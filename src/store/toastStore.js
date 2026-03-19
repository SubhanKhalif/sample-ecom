import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  // State
  const toasts = ref([])

  // Actions
  const addToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random()
    const toast = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration,
      createdAt: Date.now()
    }

    toasts.value.push(toast)

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAllToasts = () => {
    toasts.value = []
  }

  // Convenience methods for common toasts
  const showSuccess = (message, duration = 3000) => {
    return addToast(message, 'success', duration)
  }

  const showError = (message, duration = 4000) => {
    return addToast(message, 'error', duration)
  }

  const showWarning = (message, duration = 3500) => {
    return addToast(message, 'warning', duration)
  }

  const showInfo = (message, duration = 3000) => {
    return addToast(message, 'info', duration)
  }

  return {
    // State
    toasts,

    // Actions
    addToast,
    removeToast,
    clearAllToasts,

    // Convenience methods
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
})
