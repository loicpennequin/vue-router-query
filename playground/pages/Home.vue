<script setup lang="ts">
import { homeLoader } from '../loaders/homeLoader';
import Link from '@/Link.vue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const {
  todos: { isLoading, data: todos }
} = homeLoader.load();

const TODOS_PER_PAGE = 20;
const currentPage = computed(() => +router.currentRoute.value.query.page || 1);

const displayedTodos = computed(() =>
  todos.value?.slice(
    currentPage.value * TODOS_PER_PAGE - TODOS_PER_PAGE,
    currentPage.value * TODOS_PER_PAGE
  )
);
const pageCount = computed(() =>
  Math.ceil((todos.value?.length || 0) / TODOS_PER_PAGE)
);
</script>

<template>
  <h1 text-3xl m-b-6>List of Todos</h1>
  <div v-if="isLoading">Loading...</div>
  <ul v-if="todos" space-y-2>
    <li v-for="todo in displayedTodos" :key="todo.id">
      <Link :to="{ name: 'TodoDetails', params: { id: todo.id } }" underline>
        {{ todo.title }}
      </Link>
    </li>
  </ul>

  <nav flex justify-around items-center m-y-4>
    <router-link
      v-for="i in pageCount"
      :key="i"
      :to="{ query: { page: i } }"
      flex
      items-center
      justify-center
      h="6 sm:10"
      aspect-square
      :bg="currentPage === i ? 'orange-5' : 'blue-5 hover:blue-7'"
      color="white"
      @click="currentPage = i"
    >
      {{ i }}
    </router-link>
  </nav>
</template>
