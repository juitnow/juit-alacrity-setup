<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin text-center" @click="onDialogOK">
      <q-card-section v-if="props.title">
        <div class="text-h4">
          {{ props.title }}
        </div>
      </q-card-section>
      <q-card-section>
        <img v-if="svg" :src="svg" class="q-mt-lg">
        <div class="text-caption">
          {{ barcode }}
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { generateSvgDataQrCode } from '@juit/qrcode'
import { useDialogPluginComponent } from 'quasar'
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: '',
  },
  barcode: {
    type: String,
    required: true,
  },
})

const svg = computed(() => generateSvgDataQrCode(props.barcode, { ecLevel: 'H', scale: 8, margin: 0 }))

defineEmits(useDialogPluginComponent.emits)

const { onDialogOK, onDialogHide, dialogRef } = useDialogPluginComponent()
</script>
