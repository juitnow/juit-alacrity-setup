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
  <div class="row justify-center">
    <h4>Known not to be working</h4>
  </div>
  <div class="row justify-center">
    <div v-for="(barcode, i) of notWorkingCodes" :key="i" class="text-center q-ma-lg">
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
import { notWorkingCodes, unknownCodes } from '@/commands'

import QrCode from '../qrcode.vue'

</script>
