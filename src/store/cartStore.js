import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // State
  const cartItems = ref([])

  // LocalStorage key
  const STORAGE_KEY = 'vue-cart'

  // Initialize cart from localStorage
  const initializeCart = () => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY)
      if (savedCart) {
        cartItems.value = JSON.parse(savedCart)
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
      cartItems.value = []
    }
  }

  // Save cart to localStorage
  const saveCart = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems.value))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }

  // Actions
  const addToCart = (product, quantity = 1, selectedColor = '', selectedSize = '') => {
    try {
      // Validate inputs
      if (!product) {
        throw new Error('Product is required')
      }
      if (!product.inStock) {
        throw new Error('Product is out of stock')
      }
      if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0')
      }

      // Check if item already exists in cart
      const existingItemIndex = cartItems.value.findIndex(
        item => 
          item.id === product.id && 
          item.color === selectedColor && 
          item.size === selectedSize
      )

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const newQuantity = cartItems.value[existingItemIndex].quantity + quantity
        cartItems.value[existingItemIndex].quantity = newQuantity
        cartItems.value[existingItemIndex].addedAt = new Date().toISOString()
      } else {
        // Add new item to cart
        const cartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          image: product.image,
          quantity: quantity,
          color: selectedColor,
          size: selectedSize,
          brand: product.brand,
          sku: product.sku,
          category: product.category,
          features: product.features || [],
          inStock: product.inStock,
          addedAt: new Date().toISOString()
        }
        cartItems.value.push(cartItem)
      }

      saveCart()
      return true
    } catch (error) {
      console.error('Failed to add item to cart:', error)
      throw error
    }
  }

  const removeFromCart = (cartItemId) => {
    try {
      const itemIndex = cartItems.value.findIndex(item => item.id === cartItemId)
      if (itemIndex !== -1) {
        cartItems.value.splice(itemIndex, 1)
        saveCart()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to remove item from cart:', error)
      throw error
    }
  }

  const updateQuantity = (cartItemId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        throw new Error('Quantity must be greater than 0')
      }

      const itemIndex = cartItems.value.findIndex(item => item.id === cartItemId)
      if (itemIndex !== -1) {
        const item = cartItems.value[itemIndex]
        if (item.inStock && newQuantity <= 10) { // Max 10 items per product
          cartItems.value[itemIndex].quantity = newQuantity
          cartItems.value[itemIndex].updatedAt = new Date().toISOString()
          saveCart()
          return true
        } else if (!item.inStock) {
          throw new Error('Product is out of stock')
        } else {
          throw new Error('Maximum quantity reached')
        }
      }
      return false
    } catch (error) {
      console.error('Failed to update quantity:', error)
      throw error
    }
  }

  const clearCart = () => {
    try {
      cartItems.value = []
      saveCart()
      return true
    } catch (error) {
      console.error('Failed to clear cart:', error)
      throw error
    }
  }

  const increaseQuantity = (cartItemId) => {
    const item = cartItems.value.find(item => item.id === cartItemId)
    if (item) {
      updateQuantity(cartItemId, item.quantity + 1)
    }
  }

  const decreaseQuantity = (cartItemId) => {
    const item = cartItems.value.find(item => item.id === cartItemId)
    if (item && item.quantity > 1) {
      updateQuantity(cartItemId, item.quantity - 1)
    }
  }

  // Getters
  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })

  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + item.quantity
    }, 0)
  })

  const totalSavings = computed(() => {
    return cartItems.value.reduce((total, item) => {
      const itemSavings = (item.originalPrice - item.price) * item.quantity
      return total + itemSavings
    }, 0)
  })

  const cartItemsCount = computed(() => {
    return cartItems.value.length
  })

  const isInCart = (productId, color = '', size = '') => {
    return cartItems.value.some(
      item => 
        item.id === productId && 
        item.color === color && 
        item.size === size
    )
  }

  const getItemQuantity = (productId, color = '', size = '') => {
    const item = cartItems.value.find(
      item => 
        item.id === productId && 
        item.color === color && 
        item.size === size
    )
    return item ? item.quantity : 0
  }

  const getCartItem = (productId, color = '', size = '') => {
    return cartItems.value.find(
      item => 
        item.id === productId && 
        item.color === color && 
        item.size === size
    )
  }

  // Utility methods
  const getCartSummary = computed(() => {
    return {
      totalItems: totalItems.value,
      totalPrice: totalPrice.value,
      totalSavings: totalSavings.value,
      itemCount: cartItemsCount.value
    }
  })

  const getItemsByCategory = (category) => {
    return cartItems.value.filter(item => item.category === category)
  }

  const getOutOfStockItems = () => {
    return cartItems.value.filter(item => !item.inStock)
  }

  // Initialize cart on store creation
  initializeCart()

  return {
    // State
    cartItems,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    increaseQuantity,
    decreaseQuantity,

    // Getters
    totalPrice,
    totalItems,
    totalSavings,
    cartItemsCount,
    isInCart,
    getItemQuantity,
    getCartItem,
    getCartSummary,
    getItemsByCategory,
    getOutOfStockItems
  }
})
