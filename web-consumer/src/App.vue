<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { streamDevices } from './services/device_api'
import AppHeader        from './components/AppHeader.vue'
import DeviceHistory    from './components/DeviceHistory.vue'
import DeviceGrid       from './components/DeviceGrid.vue'
import DeviceList       from './components/DeviceList.vue'

const devices      = ref([])
const lastDelta    = ref('0.00')
const lastCount    = ref(0)
const countHistory = ref([])
const timeHistory  = ref([])
const MAX_HISTORY  = 40

/*
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

function startStream() {
  const startTime = Date.now()
  const temp = []

  controller = streamDevices(
    device => temp.push(device),
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
    chunkSize => {
      countHistory.value.push(chunkSize)
    }
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
