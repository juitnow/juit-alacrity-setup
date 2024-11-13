<template>
  <div class="row justify-center">
    <div v-for="([ barcode, description ], i) of barcodes" :key="i" class="text-center q-ma-lg">
      <div class="text-bold">
        {{ description }}
      </div>
      <qr-code
        :barcode="barcode"
        :title="description"
        :scale="4"
        class="q-ma-sm"
      />
    </div>
  </div>
  <div class="row justify-center">
    <div class="text-center q-ma-lg">
      <div class="text-bold">
        Test Barcode
      </div>
      <qr-code
        barcode="1234567890"
        title="Test Barcode"
        :scale="6"
        class="q-ma-sm"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import QrCode from '../qrcode.vue'

const barcodes: [ string, string ][] = [
  [ '%%01', 'Strip 1 character' ],
  [ '%%02', 'Strip 2 characters' ],
  [ '%%03', 'Strip 3 characters' ],
  [ '%%04', 'Strip 4 characters' ],
  [ '%%05', 'Strip 5 characters' ],
  [ '%%06', 'Strip 6 characters' ],
  [ '%%07', 'Strip 7 characters' ],
  [ '%%08', 'Strip 8 characters' ],
  [ '%%09', 'Strip 9 characters' ],
  [ '%%0A', 'Strip 10 characters' ],
  [ '%%0B', 'Strip 11 characters' ],
  [ '%%0C', 'Strip 12 characters' ],
  [ '%%0D', 'Strip 13 characters' ],
  [ '%%0E', 'Strip 14 characters' ],
  [ '%%0F', 'Strip 15 characters' ],
  [ '%%10', 'Strip 16 characters' ],
]
</script>
