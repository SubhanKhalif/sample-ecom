<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWishlistStore } from '../store/wishlistStore.js'
import { useCartStore } from '../store/cartStore'
import { HeartIcon, ShoppingCartIcon, TrashIcon, StarIcon } from '@heroicons/vue/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/vue/24/solid'

const router = useRouter()
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

// Computed properties
const wishlistItems = computed(() => wishlistStore.wishlistItems)
const isEmpty = computed(() => wishlistItems.value.length === 0)
const wishlistSummary = computed(() => wishlistStore.getWishlistSummary)

// Methods
const removeFromWishlist = async (productId) => {
  try {
    await wishlistStore.removeFromWishlist(productId)
    console.log('Removed from wishlist:', productId)
  } catch (error) {
    console.error('Failed to remove from wishlist:', error.message)
  }
}

const addToCart = async (product) => {
  try {
    await cartStore.addToCart(product, 1, '', '')
    // Optionally remove from wishlist after adding to cart
    // await wishlistStore.removeFromWishlist(product.id)
    console.log('Added to cart:', product.name)
  } catch (error) {
    console.error('Failed to add to cart:', error.message)
  }
}

const moveAllToCart = async () => {
  try {
    const results = await wishlistStore.moveAllToCart(cartStore)
    console.log('Move all to cart results:', results)
  } catch (error) {
    console.error('Failed to move all items to cart:', error.message)
  }
}

const clearWishlist = async () => {
  try {
    await wishlistStore.clearWishlist()
    console.log('Wishlist cleared')
  } catch (error) {
    console.error('Failed to clear wishlist:', error.message)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <div class="text-sm text-gray-600">
          {{ wishlistItems.length }} items
        </div>
      </div>
      
      <div v-if="wishlistItems.length === 0" class="bg-white rounded-lg shadow-md p-12 text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
        <p class="text-gray-600 mb-4">Save items you love to your wishlist</p>
        <router-link to="/products" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
          Browse Products
        </router-link>
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="item in wishlistItems"
          :key="item.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
        >
          <div class="relative">
            <div class="h-48 bg-gray-200 flex items-center justify-center">
              <span class="text-gray-400">Product Image</span>
            </div>
            
            <button
              @click="removeFromWishlist(item.id)"
              class="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <div v-if="!item.inStock" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span class="bg-white text-gray-900 px-3 py-1 rounded-md text-sm font-medium">Out of Stock</span>
            </div>
          </div>
          
          <div class="p-4">
            <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">{{ item.name }}</h3>
            
            <div class="flex items-center mb-2">
              <div class="flex text-yellow-400 text-sm">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
                <span class="ml-1 text-gray-600">{{ item.rating }}</span>
              </div>
              <span class="text-gray-500 text-sm ml-2">({{ item.reviews }})</span>
            </div>
            
            <div class="flex items-center justify-between mb-3">
              <div>
                <span class="text-lg font-bold text-gray-900">${{ item.price }}</span>
                <span v-if="item.originalPrice > item.price" class="text-sm text-gray-500 line-through ml-2">
                  ${{ item.originalPrice }}
                </span>
              </div>
              <div v-if="item.originalPrice > item.price" class="text-red-600 text-sm font-medium">
                {{ Math.round((1 - item.price / item.originalPrice) * 100) }}% OFF
              </div>
            </div>
            
            <button
              @click="addToCart(item)"
              :disabled="!item.inStock"
              :class="[
                'w-full py-2 px-4 rounded-md text-sm font-medium transition-colors',
                item.inStock
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              {{ item.inStock ? 'Add to Cart' : 'Out of Stock' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
