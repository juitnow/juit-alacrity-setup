<template>
  <div v-for="(keyPress, i) of modelValue" :key="i">
    <div class="keypress">
      <span v-for="({ type, value }, j) of keyPress" :key="j" :class="`keypress-${type}`">
        {{ value }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

export type Keypress = {
  type: 'key' | 'modifier' | 'updown',
  value: string,
}[]

defineProps({
  modelValue: {
    type: Array as PropType<Keypress[]>,
    required: true,
    default: () => ([]),
  },

})
</script>

<style lang="css" scoped>
  .keypress {
    background-color: rgba(191, 191, 191, 0.25);
    border: 1px solid rgba(191, 191, 191);
    border-radius: 4px;
    padding: 2px 2px;
    margin: 3px 0px;
    font-family: monospace;
    font-size: 0.8em;
  }

  .keypress-key {
    background-color: rgba(0, 127, 0, 0.25);
    border: 1px solid rgb(0, 127, 0);
    border-radius: 2px;
    padding: 0px 1px;
    margin: 0px 1px;
  }

  .keypress-modifier {
    background-color: rgba(0, 0, 255, 0.25);
    border: 1px solid rgb(0, 0, 255);
    border-radius: 2px;
    padding: 0px 1px;
    margin: 0px 1px;
  }

  .keypress-updown {
    background-color: rgba(255, 0, 0, 0.25);
    border: 1px solid rgb(255, 0, 0);
    border-radius: 2px;
    padding: 0px 1px;
    margin: 0px 1px;
  }
</style>
