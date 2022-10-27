<script setup lang="ts">
import { useQueryClient } from 'vue-query';
import { RouteLocationRaw, useRouter } from 'vue-router';

const props = withDefaults(
  defineProps<{
    prefetch?: boolean;
    to: RouteLocationRaw;
    prefetchTimeout?: number;
  }>(),
  {
    prefetch: true,
    prefetchTimeout: 250
  }
);
const queryClient = useQueryClient();

const { resolve } = useRouter();

let timeout: ReturnType<typeof setTimeout>;

const preloadData = () => {
  resolve(props.to).matched.forEach(match => {
    (match.meta.loader as any)?.preload(resolve(props.to), queryClient);
  });
};

const preloadAssets = () => {
  resolve(props.to).matched.forEach(match => {
    if (!match.components) return;
    Object.values(match.components).forEach(fn => {
      if (typeof fn !== 'function') return;
      // @ts-ignore
      fn();
    });
  });
};

const onMouseEnter = () => {
  if (props.prefetch === false) return;

  timeout = setTimeout(() => {
    preloadData();
    preloadAssets();
  }, props.prefetchTimeout);
};

const onMouseLeave = () => {
  if (!props.prefetch) return;
  clearTimeout(timeout);
};
</script>

<template>
  <router-link
    :to="props.to"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <slot />
  </router-link>
</template>
