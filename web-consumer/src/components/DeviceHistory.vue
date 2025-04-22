<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  maxPoints: {
    type: Number,
    default: 40,
  },
})

const recent = computed(() => props.data.slice(-props.maxPoints))
const maxVal = computed(() => Math.max(...recent.value, 1))
</script>

<template>
  <div class="history">
    <div v-for="(val, i) in recent" :key="i" class="bar-container" :title="val + ' devices'">
      <div class="bar" :style="{ height: (val / maxVal) * 100 + '%' }"></div>
      <span class="bar-value">{{ val }}</span>
    </div>
  </div>
</template>

<style scoped>
.history {
  display: flex;
  align-items: stretch;
  gap: 4px;
  height: 120px;
  background: #222;
  padding: 0.5rem;
  border-radius: 0.25rem;
}

.bar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  /* make percentage‐heights on .bar work */
  height: 100%;
}

.bar {
  width: 100%;
  background: hsla(160, 100%, 37%, 0.6);
  transition: height 0.3s ease;
  border-radius: 2px 2px 0 0;
}

.bar-value {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  line-height: 1;
  color: hsla(160, 100%, 37%, 0.6);
}
</style>
