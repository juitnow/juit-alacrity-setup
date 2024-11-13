<template>
  <div class="row justify-center">
    <div v-for="(barcode, i) of unknownCodes" :key="i" class="text-center q-ma-lg">
      <div class="text-bold">
        {{ barcode }}
      </div>
      <qr-code
        :barcode="barcode"
        title="Unknown"
        :scale="4"
        class="q-ma-sm"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import QrCode from '../qrcode.vue'

import { unknownCodes } from '@/commands'
</script>
