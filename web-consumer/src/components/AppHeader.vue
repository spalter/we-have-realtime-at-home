<script setup>
import { defineProps } from 'vue'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  lastDelta: { type: String, required: true },
  lastCount: { type: Number, required: true },
  historyLen: { type: Number, required: true },
  avgDelta: { type: String, required: true },
})
</script>

<template>
  <header>
    <h1>Last full‑stream took: {{ lastDelta }} s</h1>
    <p>Total devices: {{ lastCount }}</p>
    <p>Avg (last {{ historyLen }}): {{ avgDelta }} s</p>
  </header>
</template>

<style scoped>
.logo {
  width: 32px;
  height: auto;
  vertical-align: middle;
  margin-right: 0.5rem;
}
header {
  color: hsla(160, 100%, 37%, 1);
  width: 100%;
  line-height: 1.5;
  border-bottom: 1px solid hsla(160, 100%, 37%, 1);
  padding-bottom: 0.5rem;
}
</style>
