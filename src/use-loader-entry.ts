import { computed, onServerPrefetch, Ref, watch } from 'vue';
import {
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryReturnType
} from 'vue-query';
import { useRoute } from 'vue-router';
import { LoaderEntry, LoaderOptions } from './create-loader';

declare module 'vue-query' {
  function useQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options:
      | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
      | Ref<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>>
  ): UseQueryReturnType<TData, TError>;
}

export const useLoaderEntry = <
  TEntry extends LoaderOptions<any>,
  TProperty extends keyof TEntry
>(
  name: TProperty,
  queryDef: LoaderEntry<TEntry, TProperty>,
  deps: Partial<TEntry>
) => {
  const route = useRoute();
  const initialRouteName = route.name;

  const queryOptions = computed<UseQueryOptions<TEntry[TProperty]>>(() => {
    const { queryOptions = {} } = queryDef(route, deps);

    return {
      ...queryOptions,
      // options can be recomputed when leaving the page, giving wrong params to the query
      enabled: route.name === initialRouteName && queryOptions.enabled,
      onSuccess(data: any) {
        deps[name] = data;
        return (queryOptions as any).onSuccess?.(data);
      }
    };
  });

  const query = useQuery<TEntry[TProperty]>(queryOptions);
  deps[name] = query.data.value;

  const getDependentSSRPromise = () => {
    return new Promise<void>(resolve => {
      watch(
        () => queryOptions.value.enabled,
        async enabled => {
          if (!enabled) return;

          await query.suspense();
          resolve();
        },
        { immediate: true }
      );
    });
  };

  onServerPrefetch(() => {
    const { ssrPrefetch } = queryDef(route, deps);
    if (!ssrPrefetch) return;
    return query.fetchStatus.value === 'idle'
      ? getDependentSSRPromise()
      : query.suspense();
  });

  watch(
    query.data,
    newData => {
      deps[name] = newData;
    },
    { immediate: true }
  );

  return [name, query] as const;
};
