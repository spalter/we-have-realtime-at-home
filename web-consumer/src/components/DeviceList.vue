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
  <div class="device-list">
    <ul>
      <li v-for="d in props.devices" :key="d.serialnumber">
        {{ d.serialnumber }} – {{ d.name }} @ {{ d.location.lat }},{{ d.location.long }} PSI: {{ d.current_psi }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.device-list {
  background: #222;
  padding: 0.5rem;
  border-radius: 0.25rem;
}
ul {
  color: hsla(160, 100%, 37%, 1);
  list-style: none;
  margin: 0;
  padding: 0;
}

p {
  font-size: 1.2rem;
  margin: 0 0 1rem;
}
</style>
