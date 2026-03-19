<script setup>
import { computed } from 'vue'
import ProductCard from './ProductCard.vue'

const props = defineProps({
  products: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  columns: {
    type: Object,
    default: () => ({
      sm: 2,  // 2 columns on small screens (640px+)
      md: 3,  // 3 columns on medium screens (768px+)
      lg: 4,  // 4 columns on large screens (1024px+)
      xl: 5   // 5 columns on extra large screens (1280px+)
    })
  },
  gap: {
    type: String,
    default: '6'  // Tailwind spacing value
  },
  showQuickActions: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['add-to-cart', 'add-to-wishlist', 'remove-from-wishlist'])

const gridClasses = computed(() => {
  const { sm, md, lg, xl } = props.columns
  
  return [
    // Mobile-first: 1 column by default
    'grid grid-cols-1',
    // Small screens (640px+)
    sm === 2 ? 'sm:grid-cols-2' : sm === 1 ? 'sm:grid-cols-1' : '',
    // Medium screens (768px+)
    md === 3 ? 'md:grid-cols-3' : md === 2 ? 'md:grid-cols-2' : md === 1 ? 'md:grid-cols-1' : '',
    // Large screens (1024px+)
    lg === 4 ? 'lg:grid-cols-4' : lg === 3 ? 'lg:grid-cols-3' : lg === 2 ? 'lg:grid-cols-2' : lg === 1 ? 'lg:grid-cols-1' : '',
    // Extra large screens (1280px+)
    xl === 5 ? 'xl:grid-cols-5' : xl === 4 ? 'xl:grid-cols-4' : xl === 3 ? 'xl:grid-cols-3' : xl === 2 ? 'xl:grid-cols-2' : xl === 1 ? 'xl:grid-cols-1' : '',
    // Gap spacing
    `gap-${props.gap}`
  ].filter(Boolean).join(' ')
})

const gapClasses = computed(() => `gap-${props.gap}`)

const handleAddToCart = (product) => {
  emit('add-to-cart', product)
}

const handleAddToWishlist = (product) => {
  emit('add-to-wishlist', product)
}

const handleRemoveFromWishlist = (productId) => {
  emit('remove-from-wishlist', productId)
}

// Skeleton loading cards
const skeletonCards = computed(() => {
  return Array(8).fill(null)
})
</script>

<template>
  <div class="w-full">
    <!-- Loading State -->
    <div v-if="loading" :class="['grid grid-cols-1', gridClasses]">
      <div
        v-for="(_, index) in skeletonCards"
        :key="index"
        class="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
      >
        <!-- Image Skeleton -->
        <div class="h-64 bg-gray-200"></div>
        
        <!-- Content Skeleton -->
        <div class="p-4 space-y-3">
          <!-- Title Skeleton -->
          <div class="h-6 bg-gray-200 rounded w-3/4"></div>
          
          <!-- Rating Skeleton -->
          <div class="flex items-center space-x-2">
            <div class="flex space-x-1">
              <div v-for="i in 5" :key="i" class="w-4 h-4 bg-gray-200 rounded-full"></div>
            </div>
            <div class="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          
          <!-- Price Skeleton -->
          <div class="flex items-center space-x-2">
            <div class="h-6 bg-gray-200 rounded w-20"></div>
            <div class="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          
          <!-- Button Skeleton -->
          <div class="h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="products.length === 0" class="text-center py-12">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
      <p class="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
      <button class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
        Clear Filters
      </button>
    </div>

    <!-- Products Grid -->
    <div v-else :class="gridClasses">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        :show-quick-actions="showQuickActions"
        @add-to-cart="handleAddToCart"
        @add-to-wishlist="handleAddToWishlist"
        @remove-from-wishlist="handleRemoveFromWishlist"
      />
    </div>

    <!-- Load More Button (for pagination) -->
    <div v-if="products.length > 0 && !loading" class="text-center mt-8">
      <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
        Load More Products
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations for skeleton loading */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
