import { createLoader } from '@/create-loader';
import { Todo } from '../types';

export const homeLoader = createLoader<{ todos: Todo[] }>({
  todos() {
    return {
      queryOptions: {
        queryKey: ['todos'],
        queryFn: () =>
          fetch('https://jsonplaceholder.typicode.com/todos').then(
            response => response.json() as Promise<Todo[]>
          ),
        staleTime: 30_000
      }
    };
  }
});
