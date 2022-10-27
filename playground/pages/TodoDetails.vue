<script setup lang="ts">
import { todoDetailsLoader } from '../loaders/todoDetailsLoader';
import { computed } from 'vue';
import Link from '@/Link.vue';

const {
  todo: { data: todo, isLoading: isTodoLoading },
  user: { data: user, isLoading: isUserLoading },
  relatedTodos: { data: relatedTodos, isLoading: isRelatedTodosLoading }
} = todoDetailsLoader.load();

const isLoading = computed(() => isTodoLoading.value || isUserLoading.value);
</script>

<template>
  <div v-if="isLoading">Loading...</div>

  <div v-if="todo && user">
    <Link to="/" underline>Back to list</Link>
    <h1 text-3xl m-b-4>
      Todo details
      <span uppercase text-sm :color="todo.completed ? 'green-5' : 'red-5'">
        {{ todo.completed ? '' : 'not' }} completed
      </span>
    </h1>
    <div>
      By
      <span font-bold>{{ user.username }}</span>
    </div>
    <transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      mode="out-in"
      appear
    >
      <p p-3 bg="light-4" :key="todo?.title">{{ todo?.title }}</p>
    </transition>

    <h2 text-xl m-b-4 m-t-6>Other todos by this author</h2>
    <div v-if="isRelatedTodosLoading">Loading todos...</div>

    <ul v-if="relatedTodos" space-y-2>
      <li v-for="todo in relatedTodos" :key="todo.id">
        <Link :to="{ name: 'TodoDetails', params: { id: todo.id } }" underline>
          {{ todo.title }}
        </Link>
      </li>
    </ul>
  </div>
</template>
