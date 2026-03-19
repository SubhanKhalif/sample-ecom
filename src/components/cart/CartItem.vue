<script setup>
import { computed } from 'vue'
import { 
  TrashIcon, 
  PlusIcon, 
  MinusIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isUpdating: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update-quantity', 'remove-item'])

const itemTotal = computed(() => props.item.price * props.item.quantity)
const itemSavings = computed(() => (props.item.originalPrice - props.item.price) * props.item.quantity)

const canIncrease = computed(() => props.item.inStock && props.item.quantity < 10)
const canDecrease = computed(() => props.item.quantity > 1)

const handleIncreaseQuantity = () => {
  if (canIncrease.value) {
    emit('update-quantity', props.item.id, props.item.quantity + 1)
  }
}

const handleDecreaseQuantity = () => {
  if (canDecrease.value) {
    emit('update-quantity', props.item.id, props.item.quantity - 1)
  }
}

const handleRemoveItem = () => {
  emit('remove-item', props.item)
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
    <div class="flex flex-col sm:flex-row gap-6">
      <!-- Product Image -->
      <div class="shrink-0">
        <img
          :src="item.image"
          :alt="item.name"
          class="w-24 h-24 object-cover rounded-lg"
          @error="$event.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200'"
        />
      </div>

      <!-- Product Details -->
      <div class="flex-1 space-y-2">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ item.name }}</h3>
          <p class="text-sm text-gray-600">{{ item.brand }}</p>
          <p class="text-sm text-gray-500">SKU: {{ item.sku }}</p>
        </div>

        <!-- Variants -->
        <div class="flex flex-wrap gap-2">
          <span
            v-if="item.color"
            class="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded"
          >
            Color: {{ item.color }}
          </span>
          <span
            v-if="item.size"
            class="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded"
          >
            Size: {{ item.size }}
          </span>
        </div>

        <!-- Stock Status -->
        <div class="flex items-center">
          <div
            :class="[
              'w-2 h-2 rounded-full mr-2',
              item.inStock ? 'bg-green-500' : 'bg-red-500'
            ]"
          ></div>
          <span
            :class="[
              'text-sm font-medium',
              item.inStock ? 'text-green-600' : 'text-red-600'
            ]"
          >
            {{ item.inStock ? 'In Stock' : 'Out of Stock' }}
          </span>
        </div>
      </div>

      <!-- Price and Actions -->
      <div class="flex flex-col items-end justify-between space-y-4">
        <!-- Price -->
        <div class="text-right">
          <div class="text-lg font-bold text-gray-900">
            {{ formatPrice(itemTotal) }}
          </div>
          <div class="text-sm text-gray-500">
            {{ formatPrice(item.price) }} × {{ item.quantity }}
          </div>
          <div
            v-if="item.originalPrice > item.price"
            class="text-sm text-green-600"
          >
            You save {{ formatPrice(itemSavings) }}
          </div>
        </div>

        <!-- Quantity Controls -->
        <div class="flex items-center space-x-3">
          <button
            @click="handleDecreaseQuantity"
            :disabled="!canDecrease || isUpdating"
            class="p-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            :title="canDecrease ? 'Decrease quantity' : 'Cannot decrease below 1'"
          >
            <MinusIcon class="w-4 h-4" />
          </button>
          
          <span class="w-12 text-center font-semibold">{{ item.quantity }}</span>
          
          <button
            @click="handleIncreaseQuantity"
            :disabled="!canIncrease || isUpdating"
            class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md disabled:hover:shadow-none"
            :title="canIncrease ? 'Increase quantity' : item.inStock ? 'Maximum quantity reached' : 'Out of stock'"
          >
            <PlusIcon class="w-4 h-4" />
          </button>
        </div>

        <!-- Remove Button -->
        <button
          @click="handleRemoveItem"
          :disabled="isUpdating"
          class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
          title="Remove from cart"
        >
          <TrashIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for better transitions */
</style>
