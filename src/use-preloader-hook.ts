import { useRouter } from 'vue-router';
import { useQueryClient } from 'vue-query';
import { ref } from 'vue';

type Progress = {
  total: number;
  progress: number;
  percentage: number;
};
export const usePreloaderHook = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const isPreloading = ref(false);
  const progress = ref<Progress>({
    total: 0,
    progress: 0,
    percentage: 0
  });
  router.beforeEach(async (to, from, next) => {
    if (!from.name) return next();
    isPreloading.value = true;
    await Promise.all(
      to.matched.map(match =>
        (match.meta.loader as any)?.preload?.(
          to,
          queryClient,
          (infos: any) => (progress.value = infos)
        )
      )
    );
    next();
    isPreloading.value = false;
  });

  return { isPreloading, progress };
};
