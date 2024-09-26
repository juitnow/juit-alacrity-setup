<template>
  <h6 class="q-my-md">
    Device Name Barcode
  </h6>
  <div class="text-body1">
    <div>Enter the device name you want to assign in the text box below.</div>
    <div>
      The resulting barcode below can be scanned <i>after</i> scanning the
      <i>Setup Device Name</i> barcode above to assign the desired name to
      the device.
    </div>
  </div>
  <div class="row justify-center q-mt-md">
    <q-input
      ref="inputref"
      v-model="name"
      dense
      outlined
      label="Device name"
      placeholder="Scanner"
      style="width: 300px"
      :rules="[
        (value: string) => (value.length <= 16 || 'Please use maximum 16 characters'),
        (value: string) => (/^[-_ A-Za-z0-9]*$/.test(value) || 'Invalid characters in device name'),
      ]"
    />
  </div>
  <qr-code
    v-if="barcode"
    :barcode="barcode"
    title="Device Name"
    class="q-ma-lg"
  />
</template>

<script setup lang="ts">
import { QInput } from 'quasar'
import { ref, watch } from 'vue'

import QrCode from '../qrcode.vue'

const inputref = ref<QInput>()
const name = ref<string>('')
const barcode = ref<string | null>(null)

watch(name, (name) => {
  if (! name) return barcode.value = null
  if (! inputref.value?.validate(name)) return barcode.value = null
  barcode.value = name
})
</script>
