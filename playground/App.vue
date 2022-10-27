<script setup lang="ts">
import { usePreloaderHook } from '@/use-preloader-hook';
import PreloadBar from './PreloadBar.vue';

const { isPreloading, progress } = usePreloaderHook();
</script>

<template>
  <div bg="light-6" min-h-screen>
    <transition
      enter-active-class="transition-opacity duration-500"
      leave-active-class="transition-opacity duration-2O00"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <PreloadBar v-if="isPreloading" :progress="progress.percentage" />
    </transition>
    <main w-full max-w="screen-md" p="3 sm:10" bg="light-1" m-x="auto">
      <router-view />
    </main>
  </div>
</template>
