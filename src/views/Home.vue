<script setup>
import { useCounterStore } from '../stores/counter'

const counter = useCounterStore()
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Vue 3 Project Setup</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 class="text-lg font-semibold text-green-800 mb-2">✅ Technologies Included</h2>
            <ul class="text-green-700 space-y-1 text-sm">
              <li>• Vue 3 Composition API</li>
              <li>• Vite build tool</li>
              <li>• Vue Router 5</li>
              <li>• Pinia state management</li>
              <li>• Headless UI components</li>
              <li>• Heroicons</li>
              <li>• Tailwind CSS v4</li>
            </ul>
          </div>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 class="text-lg font-semibold text-blue-800 mb-2">🔧 Pinia Store Demo</h2>
            <div class="space-y-3">
              <p class="text-blue-700">Count: <span class="font-bold">{{ counter.count }}</span></p>
              <p class="text-blue-700">Double: <span class="font-bold">{{ counter.doubleCount }}</span></p>
              <div class="flex space-x-2">
                <button 
                  @click="counter.increment"
                  class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition-colors"
                >
                  +
                </button>
                <button 
                  @click="counter.decrement"
                  class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition-colors"
                >
                  -
                </button>
                <button 
                  @click="counter.reset"
                  class="bg-gray-600 hover:bg-gray-700 text-white text-sm px-3 py-1 rounded transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h2 class="text-lg font-semibold text-purple-800 mb-2">📁 Project Structure</h2>
          <pre class="text-purple-700 text-sm overflow-x-auto">
src/
├── assets/
│   └── main.css
├── components/
├── router/
│   └── index.js
├── stores/
│   └── counter.js
├── views/
│   └── Home.vue
├── App.vue
└── main.js</pre>
        </div>
      </div>
    </div>
  </div>
</template>
