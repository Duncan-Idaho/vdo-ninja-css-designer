<script setup lang="ts">
import { DragCol } from "vue-resizer";
</script>

<template>
  <header>
  </header>

  <main>
    <DragCol :left-percent="50" width="100%" height="100%" :slider-width="8">
      <template #left>
      </template>
      <template #right>
      </template>
    </DragCol>
  </main>
</template>

<style scoped>
main {
  height: 100vh;
  background: var(--color-background);
  color: var(--color-text);
}

header {
  line-height: 1.5;
  display: flex;
  position: relative;
  grid-area: menu;
}
</style>