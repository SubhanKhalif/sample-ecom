import { ref, computed } from 'vue'

export function useCart() {
  const cartItems = ref([])

  const addItem = (product, quantity = 1, options = {}) => {
    const existingItem = cartItems.value.find(item => 
      item.id === product.id && 
      item.size === options.size && 
      item.color === options.color
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        size: options.size,
        color: options.color,
        image: product.image
      })
    }
  }

  const removeItem = (itemId) => {
    cartItems.value = cartItems.value.filter(item => item.id !== itemId)
  }

  const updateQuantity = (itemId, quantity) => {
    const item = cartItems.value.find(item => item.id === itemId)
    if (item) {
      item.quantity = Math.max(1, quantity)
    }
  }

  const clearCart = () => {
    cartItems.value = []
  }

  const subtotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const shipping = computed(() => subtotal.value > 100 ? 0 : 9.99)
  const tax = computed(() => subtotal.value * 0.08)
  const total = computed(() => subtotal.value + shipping.value + tax.value)

  return {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
    shipping,
    tax,
    total
  }
}
