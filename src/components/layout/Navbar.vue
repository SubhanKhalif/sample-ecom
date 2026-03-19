<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon, Bars3Icon, ShoppingBagIcon, HeartIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const isOpen = ref(false)

// Mock data - in real app this would come from stores
const cartItems = ref(2)
const wishlistItems = ref(3)

const navigation = [
  { name: 'Home', href: '/', icon: null },
  { name: 'Products', href: '/products', icon: null },
  { name: 'Categories', href: '/categories', icon: null },
  { name: 'Deals', href: '/deals', icon: null },
  { name: 'About', href: '/about', icon: null }
]

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

const totalCartItems = computed(() => cartItems.value)
const totalWishlistItems = computed(() => wishlistItems.value)
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
          <div class="relative">
            <input
              type="text"
              placeholder="Search products..."
              class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
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
