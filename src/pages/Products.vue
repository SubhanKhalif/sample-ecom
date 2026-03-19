<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { products as allProducts, categories, getProductsByCategory } from '../data/products'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore.js'
import ProductGrid from '../components/product/ProductGrid.vue'
import FilterSidebar from '../components/product/FilterSidebar.vue'
import SortDropdown from '../components/ui/SortDropdown.vue'
import { 
  FunnelIcon, 
  XMarkIcon, 
  ChevronDownIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

// State
const products = ref([])
const isLoading = ref(true)
const showMobileFilters = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedPriceRange = ref('')
const selectedBrand = ref('')
const selectedRating = ref('')
const sortBy = ref('price-low')
const priceRanges = [
  { id: 'under-50', name: 'Under $50', min: 0, max: 50 },
  { id: '50-100', name: '$50 - $100', min: 50, max: 100 },
  { id: '100-200', name: '$100 - $200', min: 100, max: 200 },
  { id: '200-500', name: '$200 - $500', min: 200, max: 500 },
  { id: 'over-500', name: 'Over $500', min: 500, max: Infinity }
]

const brands = [...new Set(allProducts.map(p => p.brand))]
const ratings = [
  { id: '4', name: '4+ Stars', value: 4 },
  { id: '3', name: '3+ Stars', value: 3 },
  { id: '2', name: '2+ Stars', value: 2 },
  { id: '1', name: '1+ Stars', value: 1 }
]

const sortOptions = [
  { id: 'price-low', name: 'Price: Low to High', value: 'price-low' },
  { id: 'price-high', name: 'Price: High to Low', value: 'price-high' },
  { id: 'rating', name: 'Customer Rating', value: 'rating' }
]

// Computed
const filteredProducts = computed(() => {
  let filtered = [...allProducts]

  // Category filter
  if (selectedCategory.value && selectedCategory.value !== 'all') {
    filtered = filtered.filter(p => p.category === selectedCategory.value)
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query)
    )
  }

  // Price range filter
  if (selectedPriceRange.value) {
    const range = priceRanges.find(r => r.id === selectedPriceRange.value)
    if (range) {
      filtered = filtered.filter(p => p.price >= range.min && p.price <= range.max)
    }
  }

  // Brand filter
  if (selectedBrand.value) {
    filtered = filtered.filter(p => p.brand === selectedBrand.value)
  }

  // Rating filter
  if (selectedRating.value) {
    const minRating = parseInt(selectedRating.value)
    filtered = filtered.filter(p => p.rating >= minRating)
  }

  // Sort products
  switch (sortBy.value) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating)
      break
    default:
      // Default sort by rating
      filtered.sort((a, b) => b.rating - a.rating)
  }

  return filtered
})

const productCount = computed(() => filteredProducts.value.length)

const activeFiltersCount = computed(() => {
  let count = 0
  if (selectedCategory.value && selectedCategory.value !== 'all') count++
  if (searchQuery.value) count++
  if (selectedPriceRange.value) count++
  if (selectedBrand.value) count++
  if (selectedRating.value) count++
  return count
})

// Methods
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

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedPriceRange.value = ''
  selectedBrand.value = ''
  selectedRating.value = ''
  updateURL()
}

const updateURL = () => {
  const query = {}
  if (selectedCategory.value && selectedCategory.value !== 'all') {
    query.category = selectedCategory.value
  }
  if (searchQuery.value) query.search = searchQuery.value
  if (selectedPriceRange.value) query.price = selectedPriceRange.value
  if (selectedBrand.value) query.brand = selectedBrand.value
  if (selectedRating.value) query.rating = selectedRating.value
  if (sortBy.value !== 'price-low') query.sort = sortBy.value
  
  router.push({ path: '/products', query })
}

const loadFiltersFromURL = () => {
  const query = route.query
  searchQuery.value = query.search || ''
  selectedCategory.value = query.category || ''
  selectedPriceRange.value = query.price || ''
  selectedBrand.value = query.brand || ''
  selectedRating.value = query.rating || ''
  sortBy.value = query.sort || 'price-low'
}

// Lifecycle
onMounted(() => {
  loadFiltersFromURL()
  
  // Simulate loading
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})

// Watch for URL changes
watch(() => route.query, loadFiltersFromURL)

// Watch for filter changes and update URL
watch([searchQuery, selectedCategory, selectedPriceRange, selectedBrand, selectedRating, sortBy], () => {
  updateURL()
}, { deep: true })
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm sticky top-16 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Mobile filter button -->
          <button
            @click="showMobileFilters = true"
            class="lg:hidden flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <AdjustmentsHorizontalIcon class="w-5 h-5" />
            <span class="font-medium">Filters</span>
            <span
              v-if="activeFiltersCount > 0"
              class="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ activeFiltersCount }}
            </span>
          </button>

          <!-- Search bar -->
          <div class="flex-1 max-w-2xl mx-auto">
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search products..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Sort dropdown -->
          <div class="hidden lg:block">
            <SortDropdown
              :options="sortOptions"
              v-model="sortBy"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex gap-8">
        <!-- Sidebar (Desktop) -->
        <aside class="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar
            :categories="categories"
            :brands="brands"
            :price-ranges="priceRanges"
            :ratings="ratings"
            :selected-category="selectedCategory"
            :selected-brand="selectedBrand"
            :selected-price-range="selectedPriceRange"
            :selected-rating="selectedRating"
            :active-filters-count="activeFiltersCount"
            @update:category="selectedCategory = $event"
            @update:brand="selectedBrand = $event"
            @update:priceRange="selectedPriceRange = $event"
            @update:rating="selectedRating = $event"
            @clear-all="clearAllFilters"
          />
        </aside>

        <!-- Main Content -->
        <main class="flex-1">
          <!-- Results header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Products</h1>
              <p class="text-gray-600 mt-1">
                {{ productCount }} products found
                <span v-if="activeFiltersCount > 0">with {{ activeFiltersCount }} filter{{ activeFiltersCount > 1 ? 's' : '' }}</span>
              </p>
            </div>

            <!-- Mobile sort -->
            <div class="lg:hidden">
              <SortDropdown
                :options="sortOptions"
                v-model="sortBy"
              />
            </div>
          </div>

          <!-- Products Grid -->
          <ProductGrid
            :products="filteredProducts"
            :loading="isLoading"
            :columns="{ sm: 2, md: 2, lg: 3 }"
            gap="6"
            @add-to-cart="handleAddToCart"
            @add-to-wishlist="handleAddToWishlist"
            @remove-from-wishlist="handleRemoveFromWishlist"
          />

          <!-- No results -->
          <div v-if="!isLoading && filteredProducts.length === 0" class="text-center py-12">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <MagnifyingGlassIcon class="w-8 h-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p class="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
            <button
              @click="clearAllFilters"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Clear Filters
            </button>
          </div>
        </main>
      </div>
    </div>

    <!-- Mobile Filters Modal -->
    <div
      v-if="showMobileFilters"
      class="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="absolute inset-0 overflow-hidden">
        <!-- Background overlay -->
        <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showMobileFilters = false"></div>

        <!-- Panel -->
        <div class="absolute inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl">
          <div class="flex flex-col h-full">
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b">
              <h2 class="text-lg font-medium text-gray-900">Filters</h2>
              <button
                @click="showMobileFilters = false"
                class="p-2 rounded-md text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>

            <!-- Filters -->
            <div class="flex-1 overflow-y-auto p-4 space-y-6">
              <!-- Category -->
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-3">Category</h3>
                <select
                  v-model="selectedCategory"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <!-- Price Range -->
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                <select
                  v-model="selectedPriceRange"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Prices</option>
                  <option v-for="range in priceRanges" :key="range.id" :value="range.id">
                    {{ range.name }}
                  </option>
                </select>
              </div>

              <!-- Brand -->
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-3">Brand</h3>
                <select
                  v-model="selectedBrand"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Brands</option>
                  <option v-for="brand in brands" :key="brand" :value="brand">
                    {{ brand }}
                  </option>
                </select>
              </div>

              <!-- Rating -->
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-3">Customer Rating</h3>
                <select
                  v-model="selectedRating"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Ratings</option>
                  <option v-for="rating in ratings" :key="rating.id" :value="rating.value">
                    {{ rating.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Footer -->
            <div class="border-t p-4">
              <div class="flex space-x-3">
                <button
                  @click="clearAllFilters; showMobileFilters = false"
                  class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Clear All
                </button>
                <button
                  @click="showMobileFilters = false"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
