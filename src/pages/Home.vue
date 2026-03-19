<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { products as allProducts, getFeaturedProducts, getNewArrivals } from '../data/products'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore.js'
import ProductGrid from '../components/product/ProductGrid.vue'
import { 
  ArrowRightIcon,
  ShoppingCartIcon,
  SparklesIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  HeartIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const featuredProducts = ref([])
const trendingProducts = ref([])
const isLoading = ref(true)

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Latest gadgets and tech',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7cd166b?w=400',
    icon: '',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Fashion for everyone',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    icon: '',
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'home',
    name: 'Home & Garden',
    description: 'Make your space beautiful',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    icon: '',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'sports',
    name: 'Sports & Outdoors',
    description: 'Gear for your adventures',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    icon: '',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'books',
    name: 'Books',
    description: 'Expand your knowledge',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    icon: '',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'beauty',
    name: 'Beauty',
    description: 'Look and feel your best',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    icon: '',
    color: 'from-red-500 to-red-600'
  }
]

const features = [
  {
    icon: ShoppingCartIcon,
    title: 'Free Shipping',
    description: 'On orders over $50',
    color: 'text-blue-600'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure Payment',
    description: '100% secure transactions',
    color: 'text-green-600'
  },
  {
    icon: TruckIcon,
    title: 'Fast Delivery',
    description: '2-3 business days',
    color: 'text-purple-600'
  },
  {
    icon: HeartIcon,
    title: 'Best Quality',
    description: 'Premium products only',
    color: 'text-red-600'
  }
]

onMounted(async () => {
  // Simulate loading data
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  featuredProducts.value = getFeaturedProducts(8)
  trendingProducts.value = getNewArrivals(8)
  isLoading.value = false
})

const handleAddToCart = async (product) => {
  try {
    await cartStore.addToCart(product, 1, '', '')
    console.log('Added to cart:', product.name)
    // You could show a toast notification here
  } catch (error) {
    console.error('Failed to add to cart:', error.message)
    // You could show an error notification here
  }
}

const handleAddToWishlist = async (product) => {
  try {
    const success = wishlistStore.addToWishlist(product)
    if (success) {
      console.log('Added to wishlist:', product.name)
      // You could show a toast notification here
    } else {
      console.log('Product already in wishlist:', product.name)
    }
  } catch (error) {
    console.error('Failed to add to wishlist:', error.message)
    // You could show an error notification here
  }
}

const handleRemoveFromWishlist = async (productId) => {
  try {
    const success = wishlistStore.removeFromWishlist(productId)
    if (success) {
      console.log('Removed from wishlist:', productId)
      // You could show a toast notification here
    }
  } catch (error) {
    console.error('Failed to remove from wishlist:', error.message)
    // You could show an error notification here
  }
}

const navigateToCategory = (categoryId) => {
  router.push(`/products?category=${categoryId}`)
}

const navigateToProducts = () => {
  router.push('/products')
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Banner -->
    <section class="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div class="space-y-4">
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Discover Your
                <span class="text-yellow-300"> Perfect</span> Products
              </h1>
              <p class="text-xl text-blue-100 leading-relaxed">
                Shop our curated collection of premium products with unbeatable prices and exceptional quality.
              </p>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                @click="navigateToProducts"
                class="bg-white text-blue-700 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                Shop Now
                <ArrowRightIcon class="w-5 h-5 ml-2" />
              </button>
              <button class="border-2 border-white text-white hover:bg-white hover:text-blue-700 font-semibold py-3 px-8 rounded-lg transition-all duration-200">
                View Categories
              </button>
            </div>
            
            <!-- Features -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
              <div v-for="feature in features" :key="feature.title" class="text-center">
                <div class="flex justify-center mb-2">
                  <component :is="feature.icon" :class="feature.color" class="w-8 h-8" />
                </div>
                <h3 class="font-semibold text-sm">{{ feature.title }}</h3>
                <p class="text-xs text-blue-100">{{ feature.description }}</p>
              </div>
            </div>
          </div>
          
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-tr from-yellow-400 to-pink-400 rounded-2xl transform rotate-6 opacity-20"></div>
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600"
              alt="Hero Image"
              class="relative rounded-2xl shadow-2xl object-cover w-full h-96 lg:h-full"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked products that our customers love. Quality guaranteed with every purchase.
          </p>
          <div class="flex items-center justify-center mt-4">
            <SparklesIcon class="w-5 h-5 text-yellow-500 mr-2" />
            <span class="text-sm text-gray-500">Premium Selection</span>
          </div>
        </div>
        
        <ProductGrid
          :products="featuredProducts"
          :loading="isLoading"
          :columns="{ sm: 2, md: 3, lg: 4 }"
          gap="6"
          @add-to-cart="handleAddToCart"
          @add-to-wishlist="handleAddToWishlist"
          @remove-from-wishlist="handleRemoveFromWishlist"
        />
        
        <div class="text-center mt-12">
          <button
            @click="navigateToProducts"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            View All Products
          </button>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Find exactly what you're looking for in our organized categories.
          </p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="category in categories"
            :key="category.id"
            @click="navigateToCategory(category.id)"
            class="group cursor-pointer"
          >
            <div class="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div class="aspect-w-16 aspect-h-9">
                <img
                  :src="category.image"
                  :alt="category.name"
                  class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              <div class="absolute bottom-0 left-0 right-0 p-6">
                <div class="flex items-center mb-2">
                  <span class="text-3xl mr-3">{{ category.icon }}</span>
                  <h3 class="text-xl font-bold text-white">{{ category.name }}</h3>
                </div>
                <p class="text-gray-200 text-sm">{{ category.description }}</p>
              </div>
              
              <div class="absolute top-4 right-4">
                <div :class="`w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-200`">
                  <ArrowRightIcon class="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trending Products -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trending Now 
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            The hottest products that everyone's talking about. Don't miss out on these trending items!
          </p>
        </div>
        
        <ProductGrid
          :products="trendingProducts"
          :loading="isLoading"
          :columns="{ sm: 2, md: 3, lg: 4 }"
          gap="6"
          @add-to-cart="handleAddToCart"
          @add-to-wishlist="handleAddToWishlist"
          @remove-from-wishlist="handleRemoveFromWishlist"
        />
        
        <div class="text-center mt-12">
          <button
            @click="navigateToProducts"
            class="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Explore Trending
          </button>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold mb-4">
          Stay in the Loop
        </h2>
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Get exclusive deals, new product alerts, and special discounts delivered straight to your inbox.
        </p>
        
        <form class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            class="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            class="bg-white text-blue-700 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Subscribe
          </button>
        </form>
        
        <p class="text-sm text-blue-100 mt-4">
          Join 10,000+ happy subscribers. No spam, unsubscribe anytime.
        </p>
      </div>
    </section>
  </div>
</template>
