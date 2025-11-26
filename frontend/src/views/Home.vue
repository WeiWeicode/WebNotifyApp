<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center p-4">
    <header class="mb-8 text-center mt-10">
      <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 mb-2">
        WebNotifyApp
      </h1>
      <p class="text-gray-600">Stay connected with real-time push notifications</p>
    </header>

    <main class="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Tabs Header -->
      <div class="flex border-b border-gray-200">
        <button 
          @click="activeTab = 'subscription'"
          :class="['flex-1 py-4 px-6 text-center font-medium transition-colors duration-200', activeTab === 'subscription' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50']"
        >
          Subscription
        </button>
        <button 
          @click="activeTab = 'announcements'"
          :class="['flex-1 py-4 px-6 text-center font-medium transition-colors duration-200', activeTab === 'announcements' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50']"
        >
          Announcements
        </button>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Subscription Tab -->
        <div v-if="activeTab === 'subscription'">
          <NotificationManager />
        </div>

        <!-- Announcements Tab -->
        <div v-else-if="activeTab === 'announcements'" class="space-y-4">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Latest Updates</h2>
          
          <div v-for="item in announcements" :key="item.id" class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" @click="goToAnnouncement(item.id)">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-lg text-gray-800">{{ item.title }}</h3>
              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ item.date }}</span>
            </div>
            <p class="text-gray-600 text-sm line-clamp-2">{{ item.preview }}</p>
          </div>
        </div>
      </div>
    </main>

    <footer class="mt-12 text-gray-400 text-sm">
      <p>&copy; 2025 WebNotifyApp. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NotificationManager from '../components/NotificationManager.vue'

const router = useRouter()
const activeTab = ref('subscription')

const announcements = ref([
  {
    id: 123,
    title: 'Welcome to WebNotifyApp',
    date: '2025-11-26',
    preview: 'We are excited to launch our new push notification service. Stay tuned for more updates!'
  },
  {
    id: 124,
    title: 'System Maintenance',
    date: '2025-11-25',
    preview: 'Scheduled maintenance will occur on Sunday at 2:00 AM UTC. Please expect brief interruptions.'
  },
  {
    id: 125,
    title: 'New Features Released',
    date: '2025-11-20',
    preview: 'Check out the new dashboard and analytics tools we just added to your account.'
  }
])

const goToAnnouncement = (id) => {
  router.push(`/announcement/${id}`)
}
</script>
