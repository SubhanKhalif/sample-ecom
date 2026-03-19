<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWishlistStore } from '../../store/wishlistStore.js'
import { HeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/vue/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/vue/24/solid'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  showQuickActions: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['add-to-cart', 'add-to-wishlist', 'remove-from-wishlist'])

const router = useRouter()
const wishlistStore = useWishlistStore()
const isAddingToCart = ref(false)
const isHovered = ref(false)

// Check if product is in wishlist
const isInWishlist = computed(() => wishlistStore.isInWishlist(props.product.id))

const discountPercentage = computed(() => {
  if (props.product.originalPrice > props.product.price) {
    return Math.round((1 - props.product.price / props.product.originalPrice) * 100)
  }
  return 0
})

const ratingStars = computed(() => {
  const stars = []
  const fullStars = Math.floor(props.product.rating)
  const hasHalfStar = props.product.rating % 1 >= 0.5
  
  for (let i = 0; i < fullStars; i++) {
    stars.push('full')
  }
  
  if (hasHalfStar && fullStars < 5) {
    stars.push('half')
  }
  
  const emptyStars = 5 - stars.length
  for (let i = 0; i < emptyStars; i++) {
    stars.push('empty')
  }
  
  return stars
})

const handleAddToCart = async () => {
  if (isAddingToCart.value) return
  
  isAddingToCart.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
    emit('add-to-cart', props.product)
  } finally {
    isAddingToCart.value = false
  }
}

const navigateToProduct = () => {
  router.push(`/product/${props.product.id}`)
}

const handleWishlistToggle = () => {
  try {
    const success = wishlistStore.toggleWishlist(props.product)
    
    if (success) {
      if (isInWishlist.value) {
        emit('add-to-wishlist', props.product)
        console.log('Added to wishlist:', props.product.name)
      } else {
        emit('remove-from-wishlist', props.product.id)
        console.log('Removed from wishlist:', props.product.name)
      }
    }
  } catch (error) {
    console.error('Failed to toggle wishlist:', error.message)
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}
</script>

<template>
  <div 
    class="relative bg-white rounded-lg shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer border border-gray-100 hover:border-blue-200"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="navigateToProduct"
  >
    <!-- Product Image -->
    <div class="relative h-64 bg-gray-100 overflow-hidden">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        @error="$event.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'"
      />
      
      <!-- Discount Badge -->
      <div
        v-if="discountPercentage > 0"
        class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold"
      >
        -{{ discountPercentage }}%
      </div>
      
      <!-- Out of Stock Overlay -->
      <div
        v-if="!product.inStock"
        class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <span class="bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-semibold">
          Out of Stock
        </span>
      </div>
      
      <!-- Quick Actions (show on hover) -->
      <div
        v-if="showQuickActions && product.inStock"
        :class="[
          'absolute top-2 right-2 flex flex-col space-y-2 transition-all duration-300',
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        ]"
      >
        <button
          @click.stop="handleWishlistToggle"
          :class="[
            'p-2 rounded-full transition-all duration-200',
            isInWishlist
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
          ]"
          class="shadow-lg"
        >
          <HeartIcon
            :class="isInWishlist ? 'fill-current' : ''"
            class="w-5 h-5"
          />
        </button>
      </div>
    </div>
    
    <!-- Product Info -->
    <div class="p-4">
      <!-- Product Name -->
      <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
        {{ product.name }}
      </h3>
      
      <!-- Rating and Reviews -->
      <div class="flex items-center mb-3">
        <div class="flex items-center">
          <template v-for="(star, index) in ratingStars" :key="index">
            <StarIconSolid
              v-if="star === 'full'"
              class="w-4 h-4 text-yellow-400 fill-current"
            />
            <div v-else-if="star === 'half'" class="relative w-4 h-4">
              <StarIconSolid class="w-4 h-4 text-yellow-400 fill-current absolute" />
              <div class="absolute inset-0 overflow-hidden w-2">
                <StarIconSolid class="w-4 h-4 text-yellow-400 fill-current" />
              </div>
            </div>
            <StarIcon
              v-else
              class="w-4 h-4 text-gray-300"
            />
          </template>
        </div>
        <span class="ml-2 text-sm text-gray-600">
          {{ product.rating }} ({{ product.reviews }})
        </span>
      </div>
      
      <!-- Price -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-2">
          <span class="text-xl font-bold text-gray-900">
            {{ formatPrice(product.price) }}
          </span>
          <span
            v-if="product.originalPrice > product.price"
            class="text-sm text-gray-500 line-through"
          >
            {{ formatPrice(product.originalPrice) }}
          </span>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex space-x-2">
        <button
          v-if="product.inStock"
          @click.stop="handleAddToCart"
          :disabled="isAddingToCart"
          :class="[
            'flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center',
            isAddingToCart ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'
          ]"
        >
          <ShoppingCartIcon v-if="!isAddingToCart" class="w-5 h-5 mr-2" />
          <div v-else class="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          {{ isAddingToCart ? 'Adding...' : 'Add to Cart' }}
        </button>
        
        <button
          v-else
          disabled
          class="flex-1 bg-gray-300 text-gray-500 font-medium py-2 px-4 rounded-lg cursor-not-allowed"
        >
          Out of Stock
        </button>
        
        <button
          v-if="showQuickActions"
          @click.stop="handleWishlistToggle"
          :class="[
            'p-2 rounded-lg transition-all duration-200',
            isInWishlist
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
          ]"
        >
          <HeartIcon
            :class="isInWishlist ? 'fill-current' : ''"
            class="w-5 h-5"
          />
        </button>
      </div>
      
      <!-- Product Features -->
      <div v-if="product.features && product.features.length > 0" class="mt-4">
        <div class="flex flex-wrap gap-1">
          <span
            v-for="feature in product.features.slice(0, 2)"
            :key="feature"
            class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
          >
            {{ feature }}
          </span>
          <span
            v-if="product.features.length > 2"
            class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
          >
            +{{ product.features.length - 2 }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
