<script setup>
import { ref, computed } from 'vue'
import { 
  Disclosure, 
  DisclosureButton, 
  DisclosurePanel 
} from '@headlessui/vue'
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  FunnelIcon,
  XMarkIcon,
  StarIcon
} from '@heroicons/vue/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/vue/24/solid'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  brands: {
    type: Array,
    default: () => []
  },
  priceRanges: {
    type: Array,
    default: () => []
  },
  ratings: {
    type: Array,
    default: () => []
  },
  selectedCategory: {
    type: String,
    default: ''
  },
  selectedBrand: {
    type: String,
    default: ''
  },
  selectedPriceRange: {
    type: String,
    default: ''
  },
  selectedRating: {
    type: String,
    default: ''
  },
  activeFiltersCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits([
  'update:category',
  'update:brand', 
  'update:priceRange',
  'update:rating',
  'clear-all'
])

const expandedSections = ref({
  category: true,
  price: true,
  brand: true,
  rating: true
})

const toggleSection = (section) => {
  expandedSections.value[section] = !expandedSections.value[section]
}

const handleCategoryChange = (value) => {
  emit('update:category', value)
}

const handleBrandChange = (value) => {
  emit('update:brand', value)
}

const handlePriceRangeChange = (value) => {
  emit('update:priceRange', value)
}

const handleRatingChange = (value) => {
  emit('update:rating', value)
}

const handleClearAll = () => {
  emit('clear-all')
}

const clearFilter = (type) => {
  switch (type) {
    case 'category':
      emit('update:category', '')
      break
    case 'brand':
      emit('update:brand', '')
      break
    case 'price':
      emit('update:priceRange', '')
      break
    case 'rating':
      emit('update:rating', '')
      break
  }
}

const hasActiveFilter = (type) => {
  switch (type) {
    case 'category':
      return props.selectedCategory && props.selectedCategory !== ''
    case 'brand':
      return props.selectedBrand && props.selectedBrand !== ''
    case 'price':
      return props.selectedPriceRange && props.selectedPriceRange !== ''
    case 'rating':
      return props.selectedRating && props.selectedRating !== ''
    default:
      return false
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200">
      <div class="flex items-center">
        <FunnelIcon class="w-5 h-5 text-gray-500 mr-2" />
        <h3 class="text-lg font-semibold text-gray-900">Filters</h3>
        <span
          v-if="activeFiltersCount > 0"
          class="ml-2 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
        >
          {{ activeFiltersCount }}
        </span>
      </div>
      
      <button
        v-if="activeFiltersCount > 0"
        @click="handleClearAll"
        class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
      >
        Clear all
      </button>
    </div>

    <!-- Filters Content -->
    <div class="p-6 space-y-6">
      <!-- Category Filter -->
      <Disclosure as="div" :open="expandedSections.category" class="border-b border-gray-200 pb-6">
        <DisclosureButton
          @click="toggleSection('category')"
          class="w-full flex items-center justify-between text-left text-gray-900 group"
        >
          <div class="flex items-center">
            <ChevronRightIcon
              :class="[
                'w-4 h-4 transition-transform duration-200',
                expandedSections.category ? 'rotate-90' : ''
              ]"
            />
            <span class="font-medium">Category</span>
            <span
              v-if="hasActiveFilter('category')"
              class="ml-2 w-2 h-2 bg-blue-600 rounded-full"
            ></span>
          </div>
        </DisclosureButton>
        <DisclosurePanel class="mt-4">
          <div class="space-y-2">
            <label
              v-for="category in categories"
              :key="category.id"
              class="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              :class="[
                'border',
                selectedCategory === category.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <input
                type="radio"
                :name="category.id"
                :value="category.id"
                :checked="selectedCategory === category.id"
                @change="handleCategoryChange(category.id)"
                class="sr-only"
              />
              <span class="flex-1 text-sm">{{ category.name }}</span>
              <span class="text-xs text-gray-500">({{ category.count }})</span>
            </label>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <!-- Price Range Filter -->
      <Disclosure as="div" :open="expandedSections.price" class="border-b border-gray-200 pb-6">
        <DisclosureButton
          @click="toggleSection('price')"
          class="w-full flex items-center justify-between text-left text-gray-900 group"
        >
          <div class="flex items-center">
            <ChevronRightIcon
              :class="[
                'w-4 h-4 transition-transform duration-200',
                expandedSections.price ? 'rotate-90' : ''
              ]"
            />
            <span class="font-medium">Price Range</span>
            <span
              v-if="hasActiveFilter('price')"
              class="ml-2 w-2 h-2 bg-blue-600 rounded-full"
            ></span>
          </div>
        </DisclosureButton>
        <DisclosurePanel class="mt-4">
          <div class="space-y-2">
            <label
              v-for="range in priceRanges"
              :key="range.id"
              class="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              :class="[
                'border',
                selectedPriceRange === range.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <input
                type="radio"
                :name="range.id"
                :value="range.id"
                :checked="selectedPriceRange === range.id"
                @change="handlePriceRangeChange(range.id)"
                class="sr-only"
              />
              <div class="flex-1">
                <div class="text-sm font-medium">{{ range.name }}</div>
                <div class="text-xs text-gray-500">
                  {{ range.min === 0 ? 'Under $50' : `$${range.min} - $${range.max === Infinity ? '500+' : range.max}` }}
                </div>
              </div>
            </label>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <!-- Brand Filter -->
      <Disclosure as="div" :open="expandedSections.brand" class="border-b border-gray-200 pb-6">
        <DisclosureButton
          @click="toggleSection('brand')"
          class="w-full flex items-center justify-between text-left text-gray-900 group"
        >
          <div class="flex items-center">
            <ChevronRightIcon
              :class="[
                'w-4 h-4 transition-transform duration-200',
                expandedSections.brand ? 'rotate-90' : ''
              ]"
            />
            <span class="font-medium">Brand</span>
            <span
              v-if="hasActiveFilter('brand')"
              class="ml-2 w-2 h-2 bg-blue-600 rounded-full"
            ></span>
          </div>
        </DisclosureButton>
        <DisclosurePanel class="mt-4">
          <div class="space-y-2">
            <label
              v-for="brand in brands"
              :key="brand"
              class="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              :class="[
                'border',
                selectedBrand === brand
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <input
                type="radio"
                :name="brand"
                :value="brand"
                :checked="selectedBrand === brand"
                @change="handleBrandChange(brand)"
                class="sr-only"
              />
              <span class="flex-1 text-sm">{{ brand }}</span>
            </label>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <!-- Rating Filter -->
      <Disclosure as="div" :open="expandedSections.rating" class="pb-6">
        <DisclosureButton
          @click="toggleSection('rating')"
          class="w-full flex items-center justify-between text-left text-gray-900 group"
        >
          <div class="flex items-center">
            <ChevronRightIcon
              :class="[
                'w-4 h-4 transition-transform duration-200',
                expandedSections.rating ? 'rotate-90' : ''
              ]"
            />
            <span class="font-medium">Customer Rating</span>
            <span
              v-if="hasActiveFilter('rating')"
              class="ml-2 w-2 h-2 bg-blue-600 rounded-full"
            ></span>
          </div>
        </DisclosureButton>
        <DisclosurePanel class="mt-4">
          <div class="space-y-2">
            <label
              v-for="rating in ratings"
              :key="rating.id"
              class="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              :class="[
                'border',
                selectedRating === rating.value.toString()
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <input
                type="radio"
                :name="rating"
                :value="rating.value.toString()"
                :checked="selectedRating === rating.value.toString()"
                @change="handleRatingChange(rating.value.toString())"
                class="sr-only"
              />
              <div class="flex items-center flex-1">
                <div class="flex items-center mr-2">
                  <StarIconSolid
                    v-for="i in 5"
                    :key="i"
                    :class="[
                      'w-4 h-4',
                      i <= rating.value ? 'text-yellow-400' : 'text-gray-300'
                    ]"
                  />
                </div>
                <span class="text-sm font-medium">{{ rating.name }}</span>
              </div>
            </label>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <!-- Clear Individual Filters -->
      <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
        <button
          v-if="hasActiveFilter('category')"
          @click="clearFilter('category')"
          class="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <XMarkIcon class="w-4 h-4 mr-1" />
          Category
        </button>
        <button
          v-if="hasActiveFilter('price')"
          @click="clearFilter('price')"
          class="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <XMarkIcon class="w-4 h-4 mr-1" />
          Price
        </button>
        <button
          v-if="hasActiveFilter('brand')"
          @click="clearFilter('brand')"
          class="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <XMarkIcon class="w-4 h-4 mr-1" />
          Brand
        </button>
        <button
          v-if="hasActiveFilter('rating')"
          @click="clearFilter('rating')"
          class="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <XMarkIcon class="w-4 h-4 mr-1" />
          Rating
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
