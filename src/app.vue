<template>
  <q-layout view="hHh LpR fff">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Alacrity Barcode Scanner Configuration</q-toolbar-title>

        <div v-if="battery">
          {{ battery }}%
        </div>
        <q-icon size="sm" :name="batteryIcon" />
        <q-icon
          size="sm"
          class="q-mr-lg"
          :name="connected ? 'sym_r_check_circle' : 'sym_r_circle'"
          :color="connected ? 'white' : 'blue-6'"
        />

        <bluetooth @barcode="processBarcode" @battery="battery = $event" @connected="connected = $event" />
      </q-toolbar>
    </q-header>

    <q-drawer
      bordered
      side="left"
      class="q-pa-md"
      :model-value="true"
    >
      <commands @selected="selected = $event" />
    </q-drawer>

    <q-drawer
      bordered
      side="right"
      class="q-pa-md"
      :model-value="true"
    >
      <p>Scanned Barcodes</p>
      <div v-for="(barcode, i) of barcodes" :key="i">
        <barcode :barcode="barcode.barcode" :hex="barcode.hex" />
      </div>
    </q-drawer>

    <q-page-container>
      <q-page class="q-pa-md text-center">
        <div v-if="selected">
          <div class="q-my-md">
            <div v-if="selected.section" class="q-my-none text-h6">
              {{ selected.section }}
            </div>
            <div class="q-my-none text-h4">
              {{ selected.label }}
            </div>
          </div>
          <div v-if="selected.description" class="text-body1">
            <div v-for="(description, index) in selected.description" :key="index">
              {{ description }}
            </div>
          </div>
          <qr-code
            v-if="selected.barcode"
            :title="selected.label"
            :barcode="selected.barcode"
            class="q-ma-xl"
          />

          <!-- extras -->
          <device-name v-if="selected.extra === 'device-name'" />
          <chars-special v-if="selected.extra === 'chars-special-0'" :reset="selected.reset" :table="0" />
          <chars-special v-if="selected.extra === 'chars-special-1'" :reset="selected.reset" :table="1" />
          <chars-special v-if="selected.extra === 'chars-special-2'" :reset="selected.reset" :table="2" />
          <chars-special v-if="selected.extra === 'chars-special-3'" :reset="selected.reset" :table="3" />
          <chars-special v-if="selected.extra === 'chars-special-4'" :reset="selected.reset" :table="4" />
          <chars-special v-if="selected.extra === 'chars-special-5'" :reset="selected.reset" :table="5" />
          <chars-special v-if="selected.extra === 'chars-special-6'" :reset="selected.reset" :table="6" />
        </div>
        <div v-else class="q-my-md text-h4">
          Alacrity Barcode Scanner Configuration
        </div>
        <div class="text-body1 q-my-sm">
          This simple utility can be used to easily setup barcode scanners produced by
          <a href="https://alacritydirect.com/" target="_blank">Alacrity</a>.
        </div>
        <div class="text-body1 q-my-sm">
          You can find all known configuration barcodes by navigating the menu on the left,
          alongside a short description on how they work
        </div>
        <div class="text-body1 q-my-sm">
          Any barcode on these pages can be clicked through to show it full screen.
        </div>
        <div class="text-body1 q-my-sm">
          If your scanner supports Bluetooth Low Energy (BLE) then you can connect to it
          directly from this page, by clicking on the Bluetooth icon on the top-right.
        </div>
        <div class="text-body1 q-my-sm">
          Because of Web Bluetooth limitations, the device name (or a name prefix) should be
          provided in order to scan the correct device (defaults to the prefix "Scanner").
        </div>
        <div class="text-body1 q-my-sm">
          Any barcode scanned by a connected barcode scanner can be see on the right of this page.
        </div>
        <qr-code title="Enjoy" barcode="https://www.juit.com/" class="q-ma-xl" />
      </q-page>
    </q-page-container>

    <q-footer elevated class="text-center" style="z-index: 99999999">
      Made with love in Berlin by <a style="color: white" href="https://www.juit.com/" target="_blank">Juit GmbH</a>
      (Source code on <a style="color: white" href="https://github.com/juitnow/juit-alacrity-setup" target="_blank">GitHub</a>)
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import Barcode from './barcode.vue'
import Bluetooth from './bluetooth.vue'
import Commands from './commands.vue'
import CharsSpecial from './extras/chars-special.vue'
import DeviceName from './extras/device-name.vue'
import QrCode from './qrcode.vue'

import type { Command } from './commands.vue'

interface Barcode {
  barcode: string,
  hex: string,
}

const connected = ref<boolean>(true)
const selected = ref<Command | null>(null)
const barcodes = ref<Barcode[]>([])

function processBarcode(barcode: string, hex: string): void {
  // eslint-disable-next-line no-console
  console.log(`Scanned barcode "${barcode}" (${barcode.length}) [${hex}]`)
  barcodes.value.unshift({ barcode, hex })
  barcodes.value.splice(50)
}

const battery = ref<number | null>(null)
const batteryIcon = computed(() => {
  if (! battery.value) return 'sym_r_battery_unknown'

  if (battery.value <= 12.5) return 'sym_r_battery_0_bar'
  if (battery.value <= 25.0) return 'sym_r_battery_1_bar'
  if (battery.value <= 37.5) return 'sym_r_battery_2_bar'
  if (battery.value <= 50.0) return 'sym_r_battery_3_bar'
  if (battery.value <= 62.5) return 'sym_r_battery_4_bar'
  if (battery.value <= 75.0) return 'sym_r_battery_5_bar'
  if (battery.value <= 87.5) return 'sym_r_battery_6_bar'
  return 'sym_r_battery_full'
})
</script>
