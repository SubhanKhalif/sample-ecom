<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../store/cartStore'
import { TruckIcon, ShieldCheckIcon, CreditCardIcon, LockClosedIcon } from '@heroicons/vue/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/vue/24/solid'

const router = useRouter()
const cartStore = useCartStore()

// Form data
const shippingForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States'
})

const paymentForm = ref({
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
  cardholderName: ''
})

const saveAddress = ref(false)
const sameAsShipping = ref(true)
const billingForm = ref({
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States'
})

// Computed properties
const cartItems = computed(() => cartStore.cartItems)
const cartTotal = computed(() => cartStore.totalPrice)
const cartSavings = computed(() => cartStore.totalSavings)
const isCartEmpty = computed(() => cartItems.value.length === 0)
const subtotal = computed(() => cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0))
const shipping = computed(() => subtotal.value >= 50 ? 0 : 9.99)
const tax = computed(() => subtotal.value * 0.08) // 8% tax
const total = computed(() => subtotal.value + shipping.value + tax.value)

// Form validation
const isShippingFormValid = computed(() => {
  return shippingForm.value.firstName &&
         shippingForm.value.lastName &&
         shippingForm.value.email &&
         shippingForm.value.phone &&
         shippingForm.value.address &&
         shippingForm.value.city &&
         shippingForm.value.state &&
         shippingForm.value.zipCode
})

const isPaymentFormValid = computed(() => {
  return paymentForm.value.cardNumber &&
         paymentForm.value.expiryMonth &&
         paymentForm.value.expiryYear &&
         paymentForm.value.cvv &&
         paymentForm.value.cardholderName
})

const isBillingFormValid = computed(() => {
  if (sameAsShipping.value) return true
  return billingForm.value.firstName &&
         billingForm.value.lastName &&
         billingForm.value.address &&
         billingForm.value.city &&
         billingForm.value.state &&
         billingForm.value.zipCode
})

const isFormValid = computed(() => {
  return isShippingFormValid.value && isPaymentFormValid.value && isBillingFormValid.value
})

// Methods
const updateBillingAddress = () => {
  if (sameAsShipping.value) {
    billingForm.value = {
      firstName: shippingForm.value.firstName,
      lastName: shippingForm.value.lastName,
      address: shippingForm.value.address,
      city: shippingForm.value.city,
      state: shippingForm.value.state,
      zipCode: shippingForm.value.zipCode,
      country: shippingForm.value.country
    }
  }
}

const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  const matches = v.match(/\d{4,16}/g)
  const match = matches && matches[0] || ''
  const parts = []
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }
  if (parts.length) {
    return parts.join(' ')
  } else {
    return v
  }
}

const formatExpiry = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  if (v.length >= 2) {
    return v.substring(0, 2) + '/' + v.substring(2, 4)
  }
  return v
}

const handleCardNumberInput = (event) => {
  const formatted = formatCardNumber(event.target.value)
  paymentForm.value.cardNumber = formatted
  event.target.value = formatted
}

const handleExpiryInput = (event) => {
  const formatted = formatExpiry(event.target.value)
  if (formatted.includes('/')) {
    const [month, year] = formatted.split('/')
    paymentForm.value.expiryMonth = month
    paymentForm.value.expiryYear = year
  }
  event.target.value = formatted
}

const handlePlaceOrder = async () => {
  if (!isFormValid.value) {
    alert('Please fill in all required fields')
    return
  }

  try {
    // Simulate order processing
    alert('Order placed successfully! (This is a demo - no real payment processed)')

    // Clear cart after successful order
    await cartStore.clearCart()

    // Redirect to home page
    router.push('/')
  } catch (error) {
    console.error('Failed to place order:', error)
    alert('Failed to place order. Please try again.')
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// Watch for shipping address changes
import { watch } from 'vue'
watch(sameAsShipping, updateBillingAddress)
watch(shippingForm, updateBillingAddress, { deep: true })

onMounted(() => {
  if (isCartEmpty.value) {
    router.push('/cart')
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  v-model="shippingForm.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  v-model="shippingForm.phone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  v-model="shippingForm.firstName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  v-model="shippingForm.lastName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  v-model="shippingForm.address"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  v-model="shippingForm.city"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  v-model="shippingForm.state"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input
                  v-model="shippingForm.zipCode"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  v-model="shippingForm.country"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
            
            <div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div class="flex items-center">
                <div class="shrink-0">
                  <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-yellow-800 font-medium">Demo Mode</p>
                  <p class="text-sm text-yellow-700">This is a demo checkout. No real payment will be processed.</p>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                <input
                  v-model="paymentForm.cardholderName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  v-model="paymentForm.cardNumber"
                  @input="handleCardNumberInput"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input
                    @input="handleExpiryInput"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="MM/YY"
                    maxlength="5"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    v-model="paymentForm.cvv"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123"
                    maxlength="4"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div class="space-y-3 mb-6">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">$229.97</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                <span class="font-medium">FREE</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Tax</span>
                <span class="font-medium">$18.40</span>
              </div>
              <div class="border-t pt-3">
                <div class="flex justify-between">
                  <span class="text-lg font-semibold text-gray-900">Total</span>
                  <span class="text-lg font-bold text-gray-900">$248.37</span>
                </div>
              </div>
            </div>
            
            <button
              @click="placeOrder"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
