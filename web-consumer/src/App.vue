<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { streamDevices } from './services/device_api'
import AppHeader from './components/AppHeader.vue'
import DeviceHistory from './components/DeviceHistory.vue'
import DeviceGrid from './components/DeviceGrid.vue'
import DeviceList from './components/DeviceList.vue'

const devices = ref([]) // Array to hold the devices received from the stream
const lastDelta = ref('0.00') // Time taken for the last chunk of devices
const lastCount = ref(0) // Number of devices in the last chunk
const countHistory = ref([]) // Array to hold the size of each chunk received
const timeHistory = ref([]) // Array to hold the time taken for each chunk
const MAX_HISTORY = 40 // Maximum number of entries to keep in the history

/**
 * The average delta is calculated by summing the time taken for each chunk
 * and dividing by the number of chunks. The result is rounded to two decimal
 * places.
 */
const avgDelta = computed(() => {
  if (!timeHistory.value.length) return '0.00'
  const sum = timeHistory.value.reduce((a, b) => a + b, 0)
  return (sum / timeHistory.value.length).toFixed(2)
})

let controller

/**
 * The startStream function is responsible for starting the stream of devices.
 * It uses the streamDevices function to get a stream of devices and updates
 * the devices array with the new devices. It also calculates the time taken
 * for each chunk and updates the lastDelta and lastCount values. The function
 * is called recursively to keep the stream going. The countHistory array is
 * updated with the size of each chunk received.
 * The function also handles the case where the history length exceeds the
 * MAX_HISTORY constant by removing the oldest entry.
 * The function is called when the component is mounted and is aborted when
 * the component is unmounted.
 * The function uses the Date.now() method to get the current time in
 * milliseconds and calculates the delta time by subtracting the start time
 * from the current time. The delta time is then converted to seconds and
 * rounded to two decimal places. The lastDelta value is updated with the
 * delta time and the timeHistory array is updated with the new delta time.
 * If the timeHistory array exceeds the MAX_HISTORY constant, the oldest
 * entry is removed. The lastCount value is updated with the number of devices
 * received in the current chunk and the devices array is updated with the
 * new devices. The startStream function is called recursively to keep the
 * stream going. The countHistory array is updated with the size of each
 * chunk received.
 */
function startStream() {
  const startTime = Date.now()
  const temp = []

  controller = streamDevices(
    (device) => temp.push(device),
    () => {
      const delta = (Date.now() - startTime) / 1000
      lastDelta.value = delta.toFixed(2)
      timeHistory.value.push(delta)
      if (timeHistory.value.length > MAX_HISTORY) {
        timeHistory.value.shift()
      }

      lastCount.value = temp.length
      devices.value.splice(0, devices.value.length, ...temp)
      startStream()
    },
    (chunkSize) => {
      countHistory.value.push(chunkSize)
    },
  )
}

onMounted(() => startStream())
onBeforeUnmount(() => controller?.abort())
</script>

<template>
  <div class="layout">
    <AppHeader
      :lastDelta="lastDelta"
      :lastCount="lastCount"
      :historyLen="timeHistory.length"
      :avgDelta="avgDelta"
    />

    <DeviceHistory :data="countHistory" />

    <main>
      <DeviceGrid :devices="devices" />
      <br />
      <DeviceList :devices="devices" />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1em;
}
main {
  width: 100%;
}
</style>
