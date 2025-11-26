<template>
  <div class="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-10">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Web Push Notifications</h2>
    
    <div v-if="!isSupported" class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
      Push notifications are not supported in this browser.
    </div>

    <div v-else>
      <div class="mb-6">
        <p class="mb-2 text-gray-600">Status: <span :class="statusColor" class="font-semibold">{{ permissionStatus }}</span></p>
        
        <button 
          v-if="permissionStatus === 'default' || permissionStatus === 'prompt'"
          @click="requestPermission"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
        >
          Enable Notifications
        </button>
        
        <div v-else-if="permissionStatus === 'granted'" class="space-y-4">
          <button 
            @click="subscribeUser" 
            :disabled="isSubscribing || subscription"
            class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
          >
            {{ isSubscribing ? 'Subscribing...' : (subscription ? 'Subscribed' : 'Subscribe to Push') }}
          </button>

          <div v-if="subscription" class="mt-4">
            <h3 class="text-lg font-semibold mb-2 text-gray-700">Subscription Object:</h3>
            <div class="bg-gray-100 p-3 rounded overflow-x-auto text-xs font-mono border border-gray-200">
              <pre>{{ JSON.stringify(subscription, null, 2) }}</pre>
            </div>
            <button 
              @click="copySubscription"
              class="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>

        <div v-else class="p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg">
          Notifications are blocked. Please enable them in your browser settings.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const isSupported = ref('serviceWorker' in navigator && 'PushManager' in window)
const permissionStatus = ref(Notification.permission)
const subscription = ref(null)
const isSubscribing = ref(false)

// VAPID Public Key - Replace with your actual key or use a test one
// You can generate one at https://web-push-codelab.glitch.me/
const VAPID_PUBLIC_KEY = 'BKKNwQVSB2ygXyF0p5Q5aLzuClvF9IgJR97ZilT4SmZ0OBDmjap_gGxpszUKXybnl7jZ1ATS7z1VYO6CWJ1u8KQ'

const statusColor = computed(() => {
  switch (permissionStatus.value) {
    case 'granted': return 'text-green-600'
    case 'denied': return 'text-red-600'
    default: return 'text-yellow-600'
  }
})

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission()
    permissionStatus.value = permission
    if (permission === 'granted') {
      // Check if already subscribed
      await checkSubscription()
    }
  } catch (error) {
    console.error('Error requesting permission:', error)
  }
}

const checkSubscription = async () => {
  if (!isSupported.value) return
  
  const registration = await navigator.serviceWorker.ready
  const sub = await registration.pushManager.getSubscription()
  if (sub) {
    subscription.value = sub
  }
}

const subscribeUser = async () => {
  if (!isSupported.value) return
  isSubscribing.value = true
  
  try {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    })
    subscription.value = sub
    console.log('User is subscribed:', sub)
  } catch (err) {
    console.error('Failed to subscribe the user: ', err)
    alert('Failed to subscribe: ' + err.message)
  } finally {
    isSubscribing.value = false
  }
}

const copySubscription = () => {
  if (subscription.value) {
    navigator.clipboard.writeText(JSON.stringify(subscription.value))
    alert('Subscription copied to clipboard!')
  }
}

onMounted(() => {
  if (isSupported.value) {
    checkSubscription()
  }
})
</script>
