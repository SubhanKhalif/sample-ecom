<script setup>
import { ref, computed } from 'vue'
import { 
  Menu, 
  MenuButton, 
  MenuItem, 
  MenuItems
} from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

const selectedOptionName = computed(() => {
  const selected = props.options.find(option => option.value === props.modelValue)
  return selected ? selected.name : 'Sort by'
})

const selectOption = (value) => {
  emit('update:modelValue', value)
  isOpen.value = false
}
</script>

<template>
  <div class="relative">
    <Menu as="div" class="relative inline-block text-left">
      <MenuButton
        @click="isOpen = !isOpen"
        :class="[
          'inline-flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-100 transition-all duration-200'
        ]"
      >
        {{ selectedOptionName }}
        <ChevronDownIcon
          :class="[
            'ml-2 w-4 h-4 transition-transform duration-200',
            isOpen ? 'rotate-180' : ''
          ]"
        />
      </MenuButton>

      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <MenuItems
          class="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div class="py-1">
            <template v-for="option in options" :key="option.value">
              <MenuItem
                as="button"
                @click="selectOption(option.value)"
                :class="[
                  'block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                  modelValue === option.value ? 'bg-blue-50 text-blue-700' : ''
                ]"
              >
                {{ option.name }}
              </MenuItem>
            </template>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
