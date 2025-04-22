<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  devices: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="grid">
    <div
      v-for="d in props.devices"
      :key="d.serialnumber"
      :class="['card', { 'card--alarm': d.alarms?.length > 0 }]"
    >
      {{ d.current_psi }}
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 0.5rem;
}

.card {
  background: #222;
  color: hsla(160, 100%, 37%, 1);
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.card--alarm {
  background: #661010;
  color: #ff4c4c;
}
</style>
