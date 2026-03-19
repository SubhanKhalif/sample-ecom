<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="text-center">
      <div class="mb-8">
        <h1 class="text-9xl font-bold text-gray-300">404</h1>
        <h2 class="text-3xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
        <p class="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      
      <div class="space-y-4">
        <button
          @click="goHome"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
        >
          Go Back Home
        </button>
        
        <div class="text-sm text-gray-500">
          Or try searching for what you need:
        </div>
        
        <div class="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search products..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div class="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto">
        <router-link
          to="/products"
          class="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <p class="text-sm text-gray-700">Products</p>
        </router-link>
        
        <router-link
          to="/wishlist"
          class="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <p class="text-sm text-gray-700">Wishlist</p>
        </router-link>
        
        <router-link
          to="/cart"
          class="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <p class="text-sm text-gray-700">Cart</p>
        </router-link>
      </div>
    </div>
  </div>
</template>
