<template>
  <q-tree
    v-model:selected="selected"
    v-model:expanded="expanded"
    v-model:ticked="ticked"
    :nodes="tree"
    node-key="id"
    dense
    selected-color="primary"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import { nodes, tree } from './commands'

import type { Command } from './commands'

/* ===== REFS, PROPS AND EMITS ============================================== */

const selected = ref<string | null>(null)
const expanded = ref<number[]>([])
const ticked = ref<number[]>([])

const emit = defineEmits<{
  (emit: 'selected', value: Command | null): void
}>()

/* ===== SYNC UP TO THE PARENT ============================================== */

watch(selected, (selected) => {
  const node = nodes[selected || '']
  if (! node) return emit('selected', null)

  const { label, barcode, description, section, extra, reset } = node
  emit('selected', { label, barcode, description, section, extra, reset })
})

</script>
