import { QueryClient, QueryFunction, QueryKey } from 'vue-query';
import { RouteLocationNormalized } from 'vue-router';
import { LoaderEntry, LoaderOptions } from './create-loader';
import { AnyFunction, AnyRecord } from './types';
import { objectEntries } from './utils';

type UsePreloaderOptions<T extends AnyRecord> = {
  route: RouteLocationNormalized;
  queryClient: QueryClient;
  loaderOptions: LoaderOptions<T>;
  onSuccess: AnyFunction;
  onProgress: AnyFunction;
};

export const usePreloader = <T extends AnyRecord>({
  route,
  queryClient,
  loaderOptions,
  onSuccess,
  onProgress
}: UsePreloaderOptions<T>) => {
  if (typeof window === 'undefined') return onSuccess();
  if (!window.navigator.onLine) return onSuccess();

  const deps: Partial<T> = {};

  function resolveQueryKeys() {
    objectEntries(loaderOptions).forEach(([name, queryDef]) => {
      const config = queryDef(route, deps);
      const isEnabled = config.queryOptions.enabled ?? true;
      if (!isEnabled) return;

      if (!deps[name]) {
        preloadQuery(name, config);
      }
    });

    const isDone = objectEntries(loaderOptions).every(([name, queryDef]) => {
      const { waitPreloadBeforeNavigation } = queryDef(route, deps);
      return !waitPreloadBeforeNavigation || deps[name];
    });

    if (isDone) {
      onSuccess();
    }
  }

  function preloadQuery(
    name: keyof T,
    { queryOptions }: ReturnType<LoaderEntry<T, typeof name>>
  ) {
    const preloadOptions = {
      cacheTime: queryOptions.cacheTime,
      staleTime: queryOptions.staleTime
    };

    queryClient
      .fetchQuery<T[typeof name]>(
        queryOptions.queryKey as QueryKey,
        queryOptions.queryFn as QueryFunction<T[typeof name]>,
        preloadOptions
      )
      .then(data => {
        deps[name] = data;
        onProgress({
          total: Object.keys(loaderOptions).length,
          progress: Object.keys(deps).length,
          percentage:
            (Object.keys(deps).length * 100) / Object.keys(loaderOptions).length
        });
      })
      .catch(() => {})
      .finally(() => {
        resolveQueryKeys();
      });
  }

  onProgress({
    total: Object.keys(loaderOptions).length,
    progress: 0,
    percentage: 0
  });
  resolveQueryKeys();
};
