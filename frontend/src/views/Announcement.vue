<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-lg max-w-2xl w-full overflow-hidden">
      <div class="bg-blue-600 p-6 text-white">
        <h1 class="text-3xl font-bold">Announcement Details</h1>
        <p class="opacity-80 mt-2">ID: {{ $route.params.id }}</p>
      </div>
      
      <div class="p-8">
        <div class="prose max-w-none">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Important Update</h2>
          <p class="text-gray-600 mb-4">
            This is a sample announcement page. In a real application, you would fetch the details for announcement 
            <span class="font-mono bg-gray-100 px-2 py-1 rounded">{{ $route.params.id }}</span> from your API.
          </p>
          <p class="text-gray-600 mb-6">
            You arrived here by clicking on a push notification! This demonstrates deep linking capabilities.
          </p>
          
          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p class="text-yellow-700">
              <strong>Note:</strong> The content you see here is static, but the ID in the URL is dynamic.
            </p>
          </div>
        </div>

        <div class="mt-8 flex justify-end">
          <router-link 
            to="/" 
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
          >
            Back to Home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
