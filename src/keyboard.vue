<template>
  <div v-for="(keyPress, i) of modelValue" :key="i">
    <div class="keypress">
      <span v-for="({ type, value }, j) of keyPress" :key="j" :class="`keypress-${type}`">
        {{ value }}
      </span>
      <span v-if="keyPress.character" class="keypress-character">
        {{ keyPress.character }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

export type Keypress = {
  character?: string | undefined,
} & {
  type: 'key' | 'modifier' | 'updown',
  value: string,
}[]

defineProps({
  modelValue: {
    type: Array as PropType<Keypress[]>,
    required: false,
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

  .keypress-character {
    background-color: rgba(128, 128, 128, 0.25);
    border: 1px solid rgb(128, 128, 128);
    border-radius: 2px;
    padding: 0px 1px;
    margin: 0px 1px 0px 20px;
  }
</style>
