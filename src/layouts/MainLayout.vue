<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import Navbar from '../components/layout/Navbar.vue'

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Fixed Navbar -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <Navbar />
    </div>
    
    <!-- Main Content Area -->
    <main class="flex-1 pt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Content with consistent padding -->
        <div class="py-6 sm:py-8 lg:py-12">
          <router-view />
        </div>
      </div>
    </main>
    
    <!-- Footer -->
    <footer class="bg-gray-900 text-white mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Main Footer Content -->
        <div class="py-12 sm:py-16">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <!-- Company Info -->
            <div class="space-y-4">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-3">
                  <span class="text-white font-bold text-xl">S</span>
                </div>
                <h3 class="text-2xl font-bold text-white">ShopVue</h3>
              </div>
              <p class="text-gray-400 text-sm leading-relaxed">
                Your trusted online store for quality products and exceptional service. 
                Shop with confidence and enjoy the best shopping experience.
              </p>
              <div class="flex items-center space-x-2">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-green-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-gray-300 text-sm">Secure Shopping</span>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-blue-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-gray-300 text-sm">Best Prices</span>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-purple-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-gray-300 text-sm">Fast Delivery</span>
                </div>
              </div>
            </div>
            
            <!-- Shop Links -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-white flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                Shop
              </h4>
              <ul class="space-y-2">
                <li><router-link to="/products" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                  <span class="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-blue-400 transition-colors"></span>
                  All Products
                </router-link></li>
                <li><router-link to="/categories" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                  <span class="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-blue-400 transition-colors"></span>
                  Categories
                </router-link></li>
                <li><router-link to="/deals" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                  <span class="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-blue-400 transition-colors"></span>
                  Deals & Offers
                </router-link></li>
                <li><router-link to="/new-arrivals" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                  <span class="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-blue-400 transition-colors"></span>
                  New Arrivals
                </router-link></li>
                <li><router-link to="/best-sellers" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                  <span class="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-blue-400 transition-colors"></span>
                  Best Sellers
                </router-link></li>
              </ul>
            </div>
            
            <!-- Company Links -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-white flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                Company
              </h4>
              <ul class="space-y-2">
                <li><router-link to="/about" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                  <span class="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-green-400 transition-colors"></span>
                  About Us
                </router-link></li>
                <li><router-link to="/contact" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                  <span class="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-green-400 transition-colors"></span>
                  Contact Us
                </router-link></li>
                <li><router-link to="/careers" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                  <span class="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-green-400 transition-colors"></span>
                  Careers
                </router-link></li>
                <li><router-link to="/press" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                  <span class="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-green-400 transition-colors"></span>
                  Press & Media
                </router-link></li>
                <li><router-link to="/blog" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                  <span class="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-green-400 transition-colors"></span>
                  Blog
                </router-link></li>
              </ul>
            </div>
            
            <!-- Support & Newsletter -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-white flex items-center">
                <svg class="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                Support
              </h4>
              <ul class="space-y-2 mb-6">
                <li><router-link to="/help" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                  <span class="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-purple-400 transition-colors"></span>
                  Help Center
                </router-link></li>
                <li><router-link to="/shipping" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                  <span class="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-purple-400 transition-colors"></span>
                  Shipping Info
                </router-link></li>
                <li><router-link to="/returns" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                  <span class="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-purple-400 transition-colors"></span>
                  Returns & Exchanges
                </router-link></li>
                <li><router-link to="/faq" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                  <span class="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-purple-400 transition-colors"></span>
                  FAQ
                </router-link></li>
                <li><router-link to="/size-guide" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                  <span class="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-purple-400 transition-colors"></span>
                  Size Guide
                </router-link></li>
              </ul>
              
              <!-- Social Media -->
              <div class="space-y-3">
                <h5 class="text-sm font-medium text-gray-300">Follow Us</h5>
                <div class="flex space-x-3">
                  <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-200 group">
                    <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-white transition-all duration-200 group">
                    <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-gradient-to-tr from-purple-600 to-pink-600 hover:text-white transition-all duration-200 group">
                    <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                    </svg>
                  </a>
                  <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all duration-200 group">
                    <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Newsletter Section -->
        <div class="border-t border-gray-800 py-8">
          <div class="max-w-2xl mx-auto text-center">
            <h4 class="text-lg font-semibold text-white mb-2">Stay Updated</h4>
            <p class="text-gray-400 text-sm mb-6">
              Subscribe to our newsletter for exclusive deals, new arrivals, and special discounts!
            </p>
            <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                class="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
              />
              <button 
                type="submit"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Subscribe Now
              </button>
            </form>
            <p class="text-xs text-gray-500 mt-3">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>
        
        <!-- Bottom Bar -->
        <div class="border-t border-gray-800">
          <div class="py-6 sm:py-8">
            <div class="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div class="text-sm text-gray-400">
                &copy; 2024 ShopVue. All rights reserved. Made with ❤️ for better shopping experience.
              </div>
              <div class="flex flex-wrap justify-center lg:justify-end space-x-6 text-sm">
                <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <svg class="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Privacy Policy
                </a>
                <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <svg class="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Terms of Service
                </a>
                <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <svg class="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Cookie Policy
                </a>
                <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <svg class="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
