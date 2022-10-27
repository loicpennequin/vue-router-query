import { QueryClient, UseQueryOptions, UseQueryReturnType } from 'vue-query';
import { RouteLocationNormalized } from 'vue-router';
import { reactive } from 'vue';
import { objectEntries } from './utils';
import { useLoaderEntry } from './use-loader-entry';
import { AnyFunction, AnyRecord } from './types';
import { usePreloader } from './use-preloader';

export type LoaderEntry<TData, TProperty extends keyof TData> = (
  route: RouteLocationNormalized,
  deps: Partial<TData>
) => {
  queryOptions: UseQueryOptions<TData[TProperty]>;
  ssrPrefetch?: boolean;
  waitPreloadBeforeNavigation?: boolean;
};

export type LoaderOptions<TData> = {
  [Property in keyof TData]: LoaderEntry<TData, Property>;
};

export type LoaderResult<T extends AnyRecord> = {
  [Property in keyof T]: UseQueryReturnType<T[Property], any>;
};

type Loader<T extends Record<string, any>> = {
  load: () => LoaderResult<T>;
  preload: (
    route: RouteLocationNormalized,
    queryClient: QueryClient,
    onProgress?: AnyFunction
  ) => Promise<void>;
};

export const createLoader = <T extends AnyRecord>(
  options: LoaderOptions<T>
): Loader<T> => {
  return {
    load() {
      const resolvedData = reactive<Partial<T>>({});

      const entries = objectEntries(options).map(([name, queryDef]) =>
        useLoaderEntry<T, typeof name>(name, queryDef, resolvedData)
      );

      return Object.fromEntries(entries) as LoaderResult<T>;
    },
    preload(
      route: RouteLocationNormalized,
      queryClient: QueryClient,
      onProgress = () => {}
    ) {
      return new Promise<void>(resolve => {
        usePreloader<T>({
          route,
          queryClient,
          loaderOptions: options,
          onSuccess: resolve,
          onProgress
        });
      });
    }
  };
};
