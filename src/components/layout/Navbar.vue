<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon, Bars3Icon, ShoppingBagIcon, HeartIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { products } from '../../data/products'
import { useCartStore } from '../../store/cartStore'
import { useWishlistStore } from '../../store/wishlistStore'

const router = useRouter()
const route = useRoute()
const isOpen = ref(false)
const searchQuery = ref('')
const showSearchResults = ref(false)

// Initialize stores
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

// Initialize search from URL query parameter
const initializeSearchFromQuery = () => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
}

// Watch for route changes to update search query
watch(() => route.query.search, (newSearch) => {
  if (newSearch !== searchQuery.value) {
    searchQuery.value = newSearch || ''
  }
})

// Mock data - using stores instead
const totalCartItems = computed(() => cartStore.totalItems)
const totalWishlistItems = computed(() => wishlistStore.totalItems)

const navigation = [
  { name: 'Home', href: '/', icon: null },
  { name: 'Products', href: '/products', icon: null },
  { name: 'Categories', href: '/categories', icon: null },
  { name: 'Deals', href: '/deals', icon: null },
  { name: 'About', href: '/about', icon: null }
]

// Filter products based on search query
const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) {
    return []
  }
  
  const query = searchQuery.value.toLowerCase()
  return products.filter(product => 
    product.name.toLowerCase().includes(query) ||
    product.description.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query) ||
    product.brand?.toLowerCase().includes(query)
  ).slice(0, 8) // Limit to 8 results for dropdown
})

const isActiveRoute = (path) => {
  return route.path === path
}

const closeMobileMenu = () => {
  isOpen.value = false
}

const navigateToRoute = (path) => {
  router.push(path)
  closeMobileMenu()
}

const navigateToProduct = (productId) => {
  searchQuery.value = ''
  showSearchResults.value = false
  router.push(`/product/${productId}`)
  closeMobileMenu()
}

const handleSearch = (event) => {
  searchQuery.value = event.target.value
  showSearchResults.value = searchQuery.value.trim().length > 0
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ 
      path: '/products', 
      query: { search: searchQuery.value.trim() } 
    })
    showSearchResults.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  showSearchResults.value = false
  // Clear search from URL if on products page
  if (route.path === '/products' && route.query.search) {
    const { search, ...restQuery } = route.query
    router.push({ query: Object.keys(restQuery).length > 0 ? restQuery : {} })
  }
}

// Close search results when clicking outside
const handleClickOutside = (event) => {
  const searchContainer = event.target.closest('.search-container')
  if (!searchContainer) {
    showSearchResults.value = false
  }
}

// Add click outside listener
import { onMounted, onUnmounted } from 'vue'
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  initializeSearchFromQuery()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <nav class="bg-white shadow-lg relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link 
            to="/" 
            class="flex-shrink-0 flex items-center group"
            @click="closeMobileMenu"
          >
            <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-3 group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-200">
              <span class="text-white font-bold text-lg">S</span>
            </div>
            <span class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              ShopVue
            </span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden lg:block">
          <div class="flex items-center space-x-1">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              :class="[ 
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative',
                isActiveRoute(item.href)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              ]"
            >
              {{ item.name }}
              <span 
                v-if="isActiveRoute(item.href)"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
              ></span>
            </router-link>
          </div>
        </div>

        <!-- Desktop Actions -->
        <div class="hidden lg:flex items-center space-x-3">
          <!-- Search Bar -->
          <div class="search-container relative">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="handleSearch"
                @focus="showSearchResults = searchQuery.trim().length > 0"
                @keyup.enter="performSearch"
                type="text"
                placeholder="Search products..."
                class="w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <MagnifyingGlassIcon class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <XMarkIcon class="w-4 h-4" />
              </button>
            </div>

            <!-- Search Results Dropdown -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              leave-active-class="transition-all duration-150 ease-in"
              enter-from-class="opacity-0 transform scale-95 -translate-y-2"
              enter-to-class="opacity-100 transform scale-100 translate-y-0"
              leave-from-class="opacity-100 transform scale-100 translate-y-0"
              leave-to-class="opacity-0 transform scale-95 -translate-y-2"
            >
              <div
                v-if="showSearchResults && filteredProducts.length > 0"
                class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
              >
                <div class="py-2">
                  <div
                    v-for="product in filteredProducts"
                    :key="product.id"
                    @click="navigateToProduct(product.id)"
                    class="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                  >
                    <!-- Product Image -->
                    <img
                      :src="product.image"
                      :alt="product.name"
                      class="w-12 h-12 object-cover rounded-md mr-3"
                      @error="$event.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100'"
                    />
                    
                    <!-- Product Info -->
                    <div class="flex-1 min-w-0">
                      <h4 class="text-sm font-medium text-gray-900 truncate">
                        {{ product.name }}
                      </h4>
                      <p class="text-xs text-gray-500 truncate">
                        {{ product.category }}
                      </p>
                      <div class="flex items-center justify-between mt-1">
                        <span class="text-sm font-semibold text-blue-600">
                          ${{ product.price }}
                        </span>
                        <span
                          v-if="product.originalPrice > product.price"
                          class="text-xs text-gray-500 line-through"
                        >
                          ${{ product.originalPrice }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- View All Results Link -->
                <div class="border-t border-gray-200 p-3">
                  <router-link
                    to="/products"
                    @click="clearSearch"
                    class="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    View all results for "{{ searchQuery }}"
                  </router-link>
                </div>
              </div>
            </Transition>

            <!-- No Results -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              leave-active-class="transition-all duration-150 ease-in"
              enter-from-class="opacity-0 transform scale-95 -translate-y-2"
              enter-to-class="opacity-100 transform scale-100 translate-y-0"
              leave-from-class="opacity-100 transform scale-100 translate-y-0"
              leave-to-class="opacity-0 transform scale-95 -translate-y-2"
            >
              <div
                v-if="showSearchResults && filteredProducts.length === 0 && searchQuery.trim().length > 0"
                class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 p-6"
              >
                <div class="text-center">
                  <MagnifyingGlassIcon class="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p class="text-sm text-gray-600 font-medium">
                    No products found for "{{ searchQuery }}"
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    Try different keywords or browse categories
                  </p>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Wishlist -->
          <router-link
            to="/wishlist"
            class="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
            @click="closeMobileMenu"
          >
            <HeartIcon class="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            <span
              v-if="totalWishlistItems > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse"
            >
              {{ totalWishlistItems }}
            </span>
          </router-link>

          <!-- Cart -->
          <router-link
            to="/cart"
            class="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
            @click="closeMobileMenu"
          >
            <ShoppingBagIcon class="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            <span
              v-if="totalCartItems > 0"
              class="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse"
            >
              {{ totalCartItems }}
            </span>
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <div class="lg:hidden">
          <button
            @click="isOpen = true"
            class="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
          >
            <Bars3Icon class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Search Bar -->
    <div class="lg:hidden border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div class="search-container relative">
          <div class="relative">
            <input
              v-model="searchQuery"
              @input="handleSearch"
              @focus="showSearchResults = searchQuery.trim().length > 0"
              @keyup.enter="performSearch"
              type="text"
              placeholder="Search products..."
              class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <MagnifyingGlassIcon class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>

          <!-- Mobile Search Results -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            leave-active-class="transition-all duration-150 ease-in"
            enter-from-class="opacity-0 transform scale-95 -translate-y-2"
            enter-to-class="opacity-100 transform scale-100 translate-y-0"
            leave-from-class="opacity-100 transform scale-100 translate-y-0"
            leave-to-class="opacity-0 transform scale-95 -translate-y-2"
          >
            <div
              v-if="showSearchResults && filteredProducts.length > 0"
              class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-80 overflow-y-auto"
            >
              <div class="py-2">
                <div
                  v-for="product in filteredProducts"
                  :key="product.id"
                  @click="navigateToProduct(product.id)"
                  class="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                >
                  <!-- Product Image -->
                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="w-10 h-10 object-cover rounded-md mr-3"
                    @error="$event.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100'"
                  />
                  
                  <!-- Product Info -->
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-gray-900 truncate">
                      {{ product.name }}
                    </h4>
                    <p class="text-xs text-gray-500 truncate">
                      {{ product.category }}
                    </p>
                    <div class="flex items-center justify-between mt-1">
                      <span class="text-sm font-semibold text-blue-600">
                        ${{ product.price }}
                      </span>
                      <span
                        v-if="product.originalPrice > product.price"
                        class="text-xs text-gray-500 line-through"
                      >
                        ${{ product.originalPrice }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- View All Results Link -->
              <div class="border-t border-gray-200 p-3">
                <router-link
                  to="/products"
                  @click="clearSearch"
                  class="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  View all results for "{{ searchQuery }}"
                </router-link>
              </div>
            </div>
          </Transition>

          <!-- Mobile No Results -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            leave-active-class="transition-all duration-150 ease-in"
            enter-from-class="opacity-0 transform scale-95 -translate-y-2"
            enter-to-class="opacity-100 transform scale-100 translate-y-0"
            leave-from-class="opacity-100 transform scale-100 translate-y-0"
            leave-to-class="opacity-0 transform scale-95 -translate-y-2"
          >
            <div
              v-if="showSearchResults && filteredProducts.length === 0 && searchQuery.trim().length > 0"
              class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 p-4"
            >
              <div class="text-center">
                <MagnifyingGlassIcon class="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p class="text-sm text-gray-600 font-medium">
                  No products found for "{{ searchQuery }}"
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  Try different keywords or browse categories
                </p>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <TransitionRoot as="template" :show="isOpen">
      <Dialog as="div" class="relative z-50" @close="closeMobileMenu">
        <!-- Background overlay -->
        <TransitionChild
          as="template"
          enter="ease-in-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in-out duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </TransitionChild>

        <!-- Mobile menu panel -->
        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="ease-in-out duration-300"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="ease-in-out duration-300"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1 bg-white shadow-xl">
              <!-- Close button -->
              <div class="absolute top-0 right-0 -mr-16 pt-4 pr-4">
                <button
                  type="button"
                  class="m-2.5 rounded-md p-2.5 text-white hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
                  @click="closeMobileMenu"
                >
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>

              <!-- Mobile menu content -->
              <div class="flex h-full flex-col overflow-y-auto bg-white px-4 py-6 sm:px-6">
                <!-- Logo in mobile menu -->
                <div class="flex items-center mb-6">
                  <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-3">
                    <span class="text-white font-bold text-lg">S</span>
                  </div>
                  <span class="text-xl font-bold text-gray-900">ShopVue</span>
                </div>

                <!-- Navigation links -->
                <div class="space-y-1 mb-6">
                  <router-link
                    v-for="item in navigation"
                    :key="item.name"
                    :to="item.href"
                    @click="navigateToRoute(item.href)"
                    :class="[ 
                      'flex items-center px-3 py-2 rounded-lg text-base font-medium transition-all duration-200',
                      isActiveRoute(item.href)
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    ]"
                  >
                    {{ item.name }}
                    <span 
                      v-if="isActiveRoute(item.href)"
                      class="ml-auto w-2 h-2 bg-blue-600 rounded-full"
                    ></span>
                  </router-link>
                </div>

                <!-- Mobile search -->
                <div class="mb-6">
                  <div class="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>

                <!-- Mobile action buttons -->
                <div class="border-t border-gray-200 pt-6">
                  <div class="grid grid-cols-2 gap-3">
                    <router-link
                      to="/wishlist"
                      @click="navigateToRoute('/wishlist')"
                      class="flex items-center justify-center px-4 py-3 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors duration-200"
                    >
                      <HeartIcon class="w-5 h-5 mr-2" />
                      <span class="text-sm font-medium">Wishlist</span>
                      <span
                        v-if="totalWishlistItems > 0"
                        class="ml-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {{ totalWishlistItems }}
                      </span>
                    </router-link>

                    <router-link
                      to="/cart"
                      @click="navigateToRoute('/cart')"
                      class="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >
                      <ShoppingBagIcon class="w-5 h-5 mr-2" />
                      <span class="text-sm font-medium">Cart</span>
                      <span
                        v-if="totalCartItems > 0"
                        class="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {{ totalCartItems }}
                      </span>
                    </router-link>
                  </div>
                </div>

                <!-- User account section -->
                <div class="mt-auto pt-6 border-t border-gray-200">
                  <div class="space-y-3">
                    <button class="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <span class="text-sm font-medium">Sign In</span>
                    </button>
                    <button class="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                      </svg>
                      <span class="text-sm font-medium">Create Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </nav>
</template>
