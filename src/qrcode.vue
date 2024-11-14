<template>
  <div>
    <img v-if="svg" :src="svg" @click="enlarge">
    <div class="text-caption">
      {{ barcodeText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { generateSvgDataQrCode } from '@juit/qrcode'
import { Dialog } from 'quasar'
import { computed } from 'vue'

import QrDialog from './qrdialog.vue'


const props = defineProps({
  title: {
    type: String,
    required: false,
    default: '',
  },
  barcode: {
    type: [ String, Uint8Array ],
    required: true,
  },
  scale: {
    type: Number,
    required: false,
    default: 8,
  },
})

const svg = computed(() => generateSvgDataQrCode(props.barcode, { ecLevel: 'H', scale: props.scale, margin: 0 }))

const barcodeText = computed(() => {
  if (typeof props.barcode === 'string') return props.barcode
  const hex = Array.from(props.barcode).map((byte) => byte.toString(16).padStart(2, '0'))
  return `[${hex.join(',')}]`
})

function enlarge(): void {
  Dialog.create({
    component: QrDialog,

    componentProps: {
      title: props.title,
      barcode: props.barcode,
    },
  })
}
</script>
