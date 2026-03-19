<script setup>
import { useToastStore } from '../store/toastStore.js'
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'

const toastStore = useToastStore()

const getIcon = (type) => {
  switch (type) {
    case 'success':
      return CheckCircleIcon
    case 'error':
      return ExclamationCircleIcon
    case 'warning':
      return ExclamationTriangleIcon
    case 'info':
    default:
      return InformationCircleIcon
  }
}

const getIconColor = (type) => {
  switch (type) {
    case 'success':
      return 'text-green-500'
    case 'error':
      return 'text-red-500'
    case 'warning':
      return 'text-yellow-500'
    case 'info':
    default:
      return 'text-blue-500'
  }
}

const getBgColor = (type) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200'
    case 'error':
      return 'bg-red-50 border-red-200'
    case 'warning':
      return 'bg-yellow-50 border-yellow-200'
    case 'info':
    default:
      return 'bg-blue-50 border-blue-200'
  }
}

const getProgressColor = (type) => {
  switch (type) {
    case 'success':
      return 'bg-green-500'
    case 'error':
      return 'bg-red-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'info':
    default:
      return 'bg-blue-500'
  }
}
</script>

<template>
  <div class="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
    <TransitionGroup
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 transform translate-x-full scale-95"
      enter-to-class="opacity-100 transform translate-x-0 scale-100"
      leave-from-class="opacity-100 transform translate-x-0 scale-100"
      leave-to-class="opacity-0 transform -translate-x-full scale-95"
    >
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :class="[
          'flex items-start p-4 rounded-lg border shadow-lg backdrop-blur-sm bg-white/95',
          getBgColor(toast.type)
        ]"
      >
        <!-- Icon -->
        <div class="shrink-0">
          <component
            :is="getIcon(toast.type)"
            :class="['w-5 h-5', getIconColor(toast.type)]"
          />
        </div>

        <!-- Content -->
        <div class="ml-3 flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900">
            {{ toast.message }}
          </p>
        </div>

        <!-- Close Button -->
        <div class="ml-3 shrink-0">
          <button
            @click="toastStore.removeToast(toast.id)"
            class="inline-flex text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>

        <!-- Progress Bar -->
        <div
          v-if="toast.duration > 0"
          class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden"
        >
          <div
            :class="[
              'h-full transition-all duration-75 ease-linear',
              getProgressColor(toast.type)
            ]"
            :style="{ width: `${((Date.now() - toast.createdAt) / toast.duration) * 100}%` }"
          ></div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
