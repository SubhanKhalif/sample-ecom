<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductById } from '../data/products'
import { useCartStore } from '../store/cartStore'
import { 
  StarIcon, 
  HeartIcon, 
  ShoppingCartIcon,
  MinusIcon,
  PlusIcon,
  ShareIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowLeftIcon
} from '@heroicons/vue/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/vue/24/solid'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = ref(null)
const isLoading = ref(true)
const selectedImage = ref(0)
const quantity = ref(1)
const isInWishlist = ref(false)
const isAddingToCart = ref(false)

// Mock additional images for gallery
const productImages = computed(() => {
  if (!product.value) return []
  
  const baseImage = product.value.image
  return [
    baseImage,
    baseImage.replace('w=400', 'w=500&auto=format&fit=crop&q=80'),
    baseImage.replace('w=400', 'w=600&auto=format&fit=crop&q=80'),
    baseImage.replace('w=400', 'w=400&auto=format&fit=crop&q=80&sat=-2')
  ]
})

const ratingStars = computed(() => {
  if (!product.value) return []
  
  const stars = []
  const fullStars = Math.floor(product.value.rating)
  const hasHalfStar = product.value.rating % 1 >= 0.5
  
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

const discountPercentage = computed(() => {
  if (!product.value) return 0
  if (product.value.originalPrice > product.value.price) {
    return Math.round((1 - product.value.price / product.value.originalPrice) * 100)
  }
  return 0
})

const totalPrice = computed(() => {
  if (!product.value) return 0
  return (product.value.price * quantity.value).toFixed(2)
})

const inStock = computed(() => {
  return product.value?.inStock ?? false
})

const availableColors = computed(() => {
  return product.value?.colors || []
})

const availableSizes = computed(() => {
  return product.value?.sizes || []
})

const selectedColor = ref('')
const selectedSize = ref('')

onMounted(() => {
  const productId = route.params.id
  const foundProduct = getProductById(productId)
  
  if (foundProduct) {
    product.value = foundProduct
    // Set default selections
    if (availableColors.value.length > 0) {
      selectedColor.value = availableColors.value[0]
    }
    if (availableSizes.value.length > 0) {
      selectedSize.value = availableSizes.value[0]
    }
  } else {
    // Product not found, redirect to products page
    router.push('/products')
  }
  
  isLoading.value = false
})

const selectImage = (index) => {
  selectedImage.value = index
}

const incrementQuantity = () => {
  quantity.value++
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const handleAddToCart = async () => {
  if (!inStock.value || isAddingToCart.value) return
  
  isAddingToCart.value = true
  
  try {
    // Add to cart using the cart store
    await cartStore.addToCart(
      product.value,
      quantity.value,
      selectedColor.value,
      selectedSize.value
    )
    
    // Reset quantity after adding
    quantity.value = 1
    
  } catch (error) {
    console.error('Failed to add to cart:', error.message)
    // You could show a toast notification here
  } finally {
    isAddingToCart.value = false
  }
}

const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value
  
  if (isInWishlist.value) {
    console.log('Added to wishlist:', product.value.name)
  } else {
    console.log('Removed from wishlist:', product.value.name)
  }
}

const goBack = () => {
  router.go(-1)
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="isLoading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="animate-pulse">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="h-96 bg-gray-200 rounded-lg"></div>
          <div class="space-y-4">
            <div class="h-8 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            <div class="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Details -->
    <div v-else-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
      >
        <ArrowLeftIcon class="w-5 h-5 mr-2" />
        Back to Products
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Left Column - Images -->
        <div class="space-y-4">
          <!-- Main Image -->
          <div class="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
            <img
              :src="productImages[selectedImage]"
              :alt="product.name"
              class="w-full h-full object-cover"
              @error="$event.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500'"
            />
          </div>

          <!-- Thumbnail Gallery -->
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="(image, index) in productImages"
              :key="index"
              @click="selectImage(index)"
              :class="[
                'aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-2 transition-all duration-200',
                selectedImage === index
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <img
                :src="image"
                :alt="`${product.name} - Image ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- Right Column - Product Info -->
        <div class="space-y-6">
          <!-- Product Title and Basic Info -->
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>
            <div class="flex items-center space-x-4">
              <!-- Rating -->
              <div class="flex items-center">
                <div class="flex items-center">
                  <StarIconSolid
                    v-for="(star, index) in ratingStars"
                    :key="index"
                    :class="[
                      'w-5 h-5',
                      star === 'full' ? 'text-yellow-400 fill-current' : 
                      star === 'half' ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    ]"
                  />
                </div>
                <span class="ml-2 text-sm text-gray-600">
                  {{ product.rating }} ({{ product.reviews }} reviews)
                </span>
              </div>

              <!-- SKU -->
              <span class="text-sm text-gray-500">SKU: {{ product.sku }}</span>
            </div>
          </div>

          <!-- Price -->
          <div class="flex items-center space-x-3">
            <span class="text-3xl font-bold text-gray-900">
              {{ formatPrice(product.price) }}
            </span>
            <span
              v-if="product.originalPrice > product.price"
              class="text-xl text-gray-500 line-through"
            >
              {{ formatPrice(product.originalPrice) }}
            </span>
            <span
              v-if="discountPercentage > 0"
              class="bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold"
            >
              -{{ discountPercentage }}%
            </span>
          </div>

          <!-- Stock Status -->
          <div class="flex items-center">
            <div v-if="inStock" class="flex items-center text-green-600">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span class="font-medium">In Stock</span>
            </div>
            <div v-else class="flex items-center text-red-600">
              <div class="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span class="font-medium">Out of Stock</span>
            </div>
          </div>

          <!-- Description -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p class="text-gray-600 leading-relaxed">{{ product.description }}</p>
          </div>

          <!-- Features -->
          <div v-if="product.features && product.features.length > 0">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
            <ul class="space-y-2">
              <li
                v-for="feature in product.features"
                :key="feature"
                class="flex items-center text-gray-600"
              >
                <ShieldCheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                {{ feature }}
              </li>
            </ul>
          </div>

          <!-- Color Selection -->
          <div v-if="availableColors.length > 0">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Color</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="color in availableColors"
                :key="color"
                @click="selectedColor = color"
                :class="[
                  'px-4 py-2 rounded-lg border transition-all duration-200',
                  selectedColor === color
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                ]"
              >
                {{ color }}
              </button>
            </div>
          </div>

          <!-- Size Selection -->
          <div v-if="availableSizes.length > 0">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Size</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="size in availableSizes"
                :key="size"
                @click="selectedSize = size"
                :class="[
                  'px-4 py-2 rounded-lg border transition-all duration-200',
                  selectedSize === size
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                ]"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Quantity and Add to Cart -->
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div class="flex items-center space-x-3">
                <button
                  @click="decrementQuantity"
                  :disabled="quantity <= 1"
                  class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <MinusIcon class="w-5 h-5" />
                </button>
                <div class="w-20 text-center font-semibold text-lg">{{ quantity }}</div>
                <button
                  @click="incrementQuantity"
                  class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <PlusIcon class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div class="flex space-x-4">
              <button
                @click="handleAddToCart"
                :disabled="!inStock || isAddingToCart"
                :class="[
                  'flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200',
                  inStock && !isAddingToCart
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
              >
                <ShoppingCartIcon v-if="!isAddingToCart" class="w-5 h-5 mr-2" />
                <div v-else class="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {{ isAddingToCart ? 'Adding...' : 'Add to Cart' }}
              </button>

              <button
                @click="toggleWishlist"
                :class="[
                  'p-3 rounded-lg border transition-all duration-200',
                  isInWishlist
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                ]"
              >
                <HeartIcon
                  :class="isInWishlist ? 'fill-current' : ''"
                  class="w-5 h-5"
                />
              </button>

              <button class="p-3 rounded-lg border border-gray-300 hover:border-gray-400 text-gray-700 transition-colors duration-200">
                <ShareIcon class="w-5 h-5" />
              </button>
            </div>

            <!-- Total Price -->
            <div class="text-right">
              <span class="text-sm text-gray-600">Total:</span>
              <span class="text-2xl font-bold text-gray-900 ml-2">{{ formatPrice(totalPrice) }}</span>
            </div>
          </div>

          <!-- Trust Badges -->
          <div class="border-t pt-6">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <TruckIcon class="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p class="text-sm font-medium text-gray-900">Free Shipping</p>
                <p class="text-xs text-gray-500">On orders over $50</p>
              </div>
              <div>
                <ShieldCheckIcon class="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p class="text-sm font-medium text-gray-900">Secure Payment</p>
                <p class="text-xs text-gray-500">100% protected</p>
              </div>
              <div>
                <ArrowLeftIcon class="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p class="text-sm font-medium text-gray-900">Easy Returns</p>
                <p class="text-xs text-gray-500">30-day policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Not Found -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <ShoppingCartIcon class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Product Not Found</h3>
        <p class="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
        <button
          @click="router.push('/products')"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Browse Products
        </button>
      </div>
    </div>
  </div>
</template>
