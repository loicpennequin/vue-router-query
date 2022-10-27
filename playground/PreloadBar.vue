<script setup lang="ts">
const props = defineProps<{ progress: number }>();
</script>

<template>
  <div
    absolute
    top-0
    left-0
    h-3
    bg-blue-5
    w-full
    transition-transform
    origin-left
    duration-200
    :style="{ transform: `scaleX(${props.progress / 100})` }"
  />
</template>

<style scoped></style>
