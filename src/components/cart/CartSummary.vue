<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ShieldCheckIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  totalItems: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  totalSavings: {
    type: Number,
    default: 0
  },
  isUpdating: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['checkout', 'apply-promo'])

const router = useRouter()

const promoCode = ref('')
const isApplyingPromo = ref(false)

const hasSavings = computed(() => props.totalSavings > 0)
const canCheckout = computed(() => props.totalItems > 0 && !props.isUpdating)

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

const handleCheckout = () => {
  if (canCheckout.value) {
    emit('checkout')
  }
}

const handleApplyPromo = () => {
  if (promoCode.value.trim() && !isApplyingPromo.value) {
    isApplyingPromo.value = true
    
    // Simulate API call for promo code validation
    setTimeout(() => {
      emit('apply-promo', promoCode.value.trim())
      promoCode.value = ''
      isApplyingPromo.value = false
    }, 1000)
  }
}

const handlePromoKeydown = (event) => {
  if (event.key === 'Enter') {
    handleApplyPromo()
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 sticky top-8">
    <h2 class="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
    
    <!-- Summary Details -->
    <div class="space-y-3 mb-6">
      <div class="flex justify-between text-gray-600">
        <span>Subtotal ({{ totalItems }} item{{ totalItems !== 1 ? 's' : '' }})</span>
        <span>{{ formatPrice(totalPrice) }}</span>
      </div>
      
      <div class="flex justify-between text-gray-600">
        <span>Shipping</span>
        <span class="text-green-600">Free</span>
      </div>
      
      <div
        v-if="hasSavings"
        class="flex justify-between text-green-600"
      >
        <span>Total Savings</span>
        <span>-{{ formatPrice(totalSavings) }}</span>
      </div>
      
      <div class="border-t pt-3">
        <div class="flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>{{ formatPrice(totalPrice) }}</span>
        </div>
      </div>
    </div>

    <!-- Promo Code -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Promo Code
      </label>
      <div class="flex space-x-2">
        <input
          v-model="promoCode"
          type="text"
          placeholder="Enter code"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @keydown="handlePromoKeydown"
          :disabled="isApplyingPromo"
        />
        <button
          @click="handleApplyPromo"
          :disabled="!promoCode.trim() || isApplyingPromo"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isApplyingPromo" class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8C4 4 4 4 4 8"></path>
            </svg>
            Applying...
          </span>
          <span v-else>Apply</span>
        </button>
      </div>
    </div>

    <!-- Checkout Button -->
    <button
      @click="handleCheckout"
      :disabled="!canCheckout"
      class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
    >
      <svg
        v-if="isUpdating"
        class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8C4 4 4 4 4 8"></path>
      </svg>
      <span v-else>Proceed to Checkout</span>
    </button>

    <!-- Security Badge -->
    <div class="mt-4 text-center">
      <div class="flex items-center justify-center text-xs text-gray-500">
        <ShieldCheckIcon class="w-4 h-4 mr-1" />
        Secure checkout powered by SSL
      </div>
    </div>

    <!-- Trust Badges -->
    <div class="mt-6 grid grid-cols-3 gap-2 text-center">
      <div class="p-2">
        <svg class="w-6 h-6 text-blue-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1V9a1 1 0 012 0v6a1 1 0 01-1 1h-1a1 1 0 01-1-1V9a1 1 0 00-2 0v6a1 1 0 01-1 1h-1a1 1 0 01-1-1V9a1 1 0 012 0v6a1 1 0 001 1h1a1 1 0 001-1V6a1 1 0 00-1-1h-1a1 1 0 00-1 1v10a1 1 0 001 1h1a1 1 0 001-1z"></path>
        </svg>
        <p class="text-xs text-gray-600">Free Shipping</p>
      </div>
      <div class="p-2">
        <svg class="w-6 h-6 text-green-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-xs text-gray-600">Secure</p>
      </div>
      <div class="p-2">
        <svg class="w-6 h-6 text-purple-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5M11 17l5-5m-5 5h12m-12 0a8 8 0 018-8 8 8 0 018 8z"></path>
        </svg>
        <p class="text-xs text-gray-600">Returns</p>
      </div>
    </div>

    <!-- Additional Info -->
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="text-sm font-semibold text-gray-900 mb-2">Order Information</h3>
      <ul class="text-xs text-gray-600 space-y-1">
        <li class="flex items-center">
          <span class="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
          Free shipping on orders over $50
        </li>
        <li class="flex items-center">
          <span class="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
          30-day return policy
        </li>
        <li class="flex items-center">
          <span class="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
          24/7 customer support
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for better transitions */
</style>
