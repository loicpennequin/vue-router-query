import { createLoader } from '@/create-loader';
import { Todo, User } from '../types';

export const todoDetailsLoader = createLoader<{
  todo: Todo;
  user: User;
  relatedTodos: Todo[];
}>({
  todo(route) {
    return {
      queryOptions: {
        queryKey: ['todo', route.params.id],
        queryFn: () =>
          fetch(
            `https://jsonplaceholder.typicode.com/todos/${route.params.id}`
          ).then(response => response.json() as Promise<Todo>),
        staleTime: 30_000
      },
      waitPreloadBeforeNavigation: true
    };
  },

  user(route, deps) {
    return {
      queryOptions: {
        queryKey: ['user', deps.todo?.userId],
        queryFn: () =>
          fetch(
            `https://jsonplaceholder.typicode.com/users/${deps.todo?.userId}`
          ).then(response => response.json() as Promise<User>),
        enabled: !!deps.todo,
        staleTime: 30_000
      },
      waitPreloadBeforeNavigation: true
    };
  },

  relatedTodos(route, deps) {
    return {
      queryOptions: {
        queryKey: ['userTodos', deps.user?.id],
        queryFn: () =>
          fetch(
            `https://jsonplaceholder.typicode.com/users/${deps.todo?.userId}/todos`
          ).then(response => response.json() as Promise<Todo[]>),
        enabled: !!deps.user,
        staleTime: 30_000
      }
    };
  }
});
