<template>
  <div class="row justify-center q-mt-md">
    <q-input
      v-model="barcode"
      label="Barcode Data"
      style="width: 300px"
      :error="!! error"
      :error-message="error"
      outlined
      dense
    />
  </div>
  <div class="row justify-center q-mt-none">
    <q-toggle
      v-model="latin1"
      label="Latin 1 (Binary)"
    />
  </div>
  <qr-code
    v-if="data"
    :title="barcode"
    :barcode="data"
    class="q-ma-lg"
  />
</template>

<script setup lang="ts">
import { QInput } from 'quasar'
import { ref, watch } from 'vue'

import QrCode from '../qrcode.vue'

const barcode = ref<string>('FO\xD6B\xC4R\xC3\x96XX')
const latin1 = ref<boolean>(false)
const error = ref<string>()
const data = ref<string | Uint8Array>()

watch([ barcode, latin1 ], ([ barcode, latin1 ]) => {
  if (! barcode) {
    error.value = undefined
    data.value = undefined
    return
  }

  if (latin1) {
    const array = new Uint8Array(barcode.length)

    for (let i = 0; i < barcode.length; i++) {
      const code = barcode.charCodeAt(i)
      if (code < 0x100) {
        array[i] = code
      } else {
        error.value = `Unable to encode character "\\x${code.toString(16).padStart(4, '0')}" at position ${i}`
        data.value = undefined
        return
      }
    }

    data.value = array
    error.value = undefined
  } else {
    try {
      data.value = new TextEncoder().encode(barcode)
      error.value = undefined
    } catch (error: any) {
      error.value = error.message || 'Unable to encode in UTF8'
      data.value = undefined
    }
  }
}, { immediate: true })
</script>
