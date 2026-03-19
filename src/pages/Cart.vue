<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../store/cartStore'
import CartItem from '../components/cart/CartItem.vue'
import CartSummary from '../components/cart/CartSummary.vue'
import { 
  ShoppingCartIcon, 
  ArrowLeftIcon,
  ShoppingBagIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const cartStore = useCartStore()

const isLoading = ref(false)
const isUpdating = ref(false)

// Computed properties
const cartItems = computed(() => cartStore.cartItems)
const totalPrice = computed(() => cartStore.totalPrice)
const totalItems = computed(() => cartStore.totalItems)
const totalSavings = computed(() => cartStore.totalSavings)
const isEmpty = computed(() => cartItems.value.length === 0)

// Methods
const handleUpdateQuantity = async (itemId, newQuantity) => {
  if (isUpdating.value) return
  
  isUpdating.value = true
  try {
    await cartStore.updateQuantity(itemId, newQuantity)
  } catch (error) {
    console.error('Failed to update quantity:', error.message)
    // You could show a toast notification here
  } finally {
    isUpdating.value = false
  }
}

const handleRemoveItem = async (item) => {
  if (isUpdating.value) return
  
  isUpdating.value = true
  try {
    await cartStore.removeFromCart(item.id)
  } catch (error) {
    console.error('Failed to remove item:', error.message)
    // You could show a toast notification here
  } finally {
    isUpdating.value = false
  }
}

const clearCart = async () => {
  if (isUpdating.value || !confirm('Are you sure you want to clear your entire cart?')) return
  
  isUpdating.value = true
  try {
    await cartStore.clearCart()
  } catch (error) {
    console.error('Failed to clear cart:', error.message)
  } finally {
    isUpdating.value = false
  }
}

const goToProducts = () => {
  router.push('/products')
}

const goToCheckout = () => {
  router.push('/checkout')
}

const handlePromoApply = (promoCode) => {
  console.log('Applying promo code:', promoCode)
  // Here you would integrate with your promo code system
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center">
          <button
            @click="goToProducts"
            class="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeftIcon class="w-5 h-5 mr-2" />
            Continue Shopping
          </button>
          <h1 class="text-3xl font-bold text-gray-900 ml-8">Shopping Cart</h1>
        </div>
        
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <ShoppingBagIcon class="w-5 h-5" />
          <span>{{ totalItems }} item{{ totalItems !== 1 ? 's' : '' }}</span>
        </div>
      </div>

      <!-- Empty Cart -->
      <div v-if="isEmpty" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
          <ShoppingCartIcon class="w-12 h-12 text-gray-400" />
        </div>
        
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
        </p>
        
        <button
          @click="goToProducts"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
        >
          Start Shopping
        </button>
      </div>

      <!-- Cart Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Clear Cart Button -->
          <div class="flex justify-end">
            <button
              @click="clearCart"
              :disabled="isUpdating"
              class="text-sm text-red-600 hover:text-red-700 font-medium transition-colors duration-200 disabled:opacity-50"
            >
              Clear Cart
            </button>
          </div>

          <!-- Cart Item List -->
          <CartItem
            v-for="item in cartItems"
            :key="`${item.id}-${item.color}-${item.size}`"
            :item="item"
            :is-updating="isUpdating"
            @update-quantity="handleUpdateQuantity"
            @remove-item="handleRemoveItem"
          />
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <CartSummary
            :total-items="totalItems"
            :total-price="totalPrice"
            :total-savings="totalSavings"
            :is-updating="isUpdating"
            @checkout="goToCheckout"
            @apply-promo="handlePromoApply"
          />
        </div>
      </div>
    </div>
  </div>
</template>
