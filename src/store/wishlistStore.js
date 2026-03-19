import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWishlistStore = defineStore('wishlist', () => {
  // State
  const wishlistItems = ref([])

  // LocalStorage key
  const STORAGE_KEY = 'vue-wishlist'

  // Initialize wishlist from localStorage
  const initializeWishlist = () => {
    try {
      const savedWishlist = localStorage.getItem(STORAGE_KEY)
      if (savedWishlist) {
        wishlistItems.value = JSON.parse(savedWishlist)
      }
    } catch (error) {
      console.error('Failed to load wishlist from localStorage:', error)
      wishlistItems.value = []
    }
  }

  // Save wishlist to localStorage
  const saveWishlist = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems.value))
    } catch (error) {
      console.error('Failed to save wishlist to localStorage:', error)
    }
  }

  // Actions
  const addToWishlist = (product) => {
    try {
      // Validate input
      if (!product) {
        throw new Error('Product is required')
      }

      // Check if item already exists in wishlist
      const existingItemIndex = wishlistItems.value.findIndex(
        item => item.id === product.id
      )

      if (existingItemIndex === -1) {
        // Add new item to wishlist
        const wishlistItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          image: product.image,
          brand: product.brand,
          sku: product.sku,
          category: product.category,
          features: product.features || [],
          inStock: product.inStock,
          rating: product.rating,
          reviews: product.reviews,
          addedAt: new Date().toISOString()
        }
        wishlistItems.value.push(wishlistItem)
        saveWishlist()
        return true
      } else {
        // Item already in wishlist
        return false
      }
    } catch (error) {
      console.error('Failed to add item to wishlist:', error)
      throw error
    }
  }

  const removeFromWishlist = (productId) => {
    try {
      const itemIndex = wishlistItems.value.findIndex(item => item.id === productId)
      if (itemIndex !== -1) {
        wishlistItems.value.splice(itemIndex, 1)
        saveWishlist()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to remove item from wishlist:', error)
      throw error
    }
  }

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      return removeFromWishlist(product.id)
    } else {
      return addToWishlist(product)
    }
  }

  const clearWishlist = () => {
    try {
      wishlistItems.value = []
      saveWishlist()
      return true
    } catch (error) {
      console.error('Failed to clear wishlist:', error)
      throw error
    }
  }

  // Getters
  const wishlistItemsCount = computed(() => wishlistItems.value.length)

  const isInWishlist = (productId) => {
    return wishlistItems.value.some(item => item.id === productId)
  }

  const getWishlistItem = (productId) => {
    return wishlistItems.value.find(item => item.id === productId)
  }

  const getWishlistSummary = computed(() => {
    const totalItems = wishlistItems.value.length
    const totalPrice = wishlistItems.value.reduce((total, item) => {
      return total + item.price
    }, 0)
    const inStockItems = wishlistItems.value.filter(item => item.inStock).length
    const outOfStockItems = totalItems - inStockItems

    return {
      totalItems,
      totalPrice,
      inStockItems,
      outOfStockItems
    }
  })

  const getItemsByCategory = (category) => {
    return wishlistItems.value.filter(item => item.category === category)
  }

  const getInStockItems = () => {
    return wishlistItems.value.filter(item => item.inStock)
  }

  const getOutOfStockItems = () => {
    return wishlistItems.value.filter(item => !item.inStock)
  }

  const getRecentlyAdded = (limit = 5) => {
    return [...wishlistItems.value]
      .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
      .slice(0, limit)
  }

  // Utility methods
  const moveWishlistToCart = async (productId, cartStore, quantity = 1, selectedColor = '', selectedSize = '') => {
    try {
      const wishlistItem = getWishlistItem(productId)
      if (wishlistItem) {
        await cartStore.addToCart(wishlistItem, quantity, selectedColor, selectedSize)
        removeFromWishlist(productId)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to move item from wishlist to cart:', error)
      throw error
    }
  }

  const moveAllToCart = async (cartStore) => {
    try {
      const inStockItems = getInStockItems()
      const results = []
      
      for (const item of inStockItems) {
        try {
          await cartStore.addToCart(item, 1, '', '')
          removeFromWishlist(item.id)
          results.push({ success: true, item: item.name })
        } catch (error) {
          results.push({ success: false, item: item.name, error: error.message })
        }
      }
      
      return results
    } catch (error) {
      console.error('Failed to move all items to cart:', error)
      throw error
    }
  }

  // Initialize wishlist on store creation
  initializeWishlist()

  return {
    // State
    wishlistItems,

    // Actions
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    moveWishlistToCart,
    moveAllToCart,

    // Getters
    wishlistItemsCount,
    isInWishlist,
    getWishlistItem,
    getWishlistSummary,
    getItemsByCategory,
    getInStockItems,
    getOutOfStockItems,
    getRecentlyAdded
  }
})
