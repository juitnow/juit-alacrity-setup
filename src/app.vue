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
      <commands @selected="selected = $event;" />
    </q-drawer>

    <q-drawer
      bordered
      side="right"
      class="q-pa-md"
      :model-value="true"
    >
      <div class="column" style="height: 100%; overflow: scroll;">
        <div class="text-h6">
          Scanned Barcodes
          <q-icon name="sym_r_cancel" size="xs" @click="barcodes = []" />
        </div>
        <div class="col">
          <div v-for="(barcode, i) of barcodes" :key="i">
            <barcode :barcode="barcode.barcode" :hex="barcode.hex" />
          </div>
        </div>
        <div class="text-h6">
          Keyboard Events
          <q-icon name="sym_r_cancel" size="xs" @click="keyPresses = []" />
        </div>
        <div class="col" style="overflow: scroll;">
          <keyboard v-model="keyPresses" />
        </div>
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
            :scale="8"
          />

          <!-- extras -->
          <chars-special v-if="selected.extra === 'chars-special'" />
          <device-name v-if="selected.extra === 'device-name'" />
          <strip-characters v-if="selected.extra === 'strip-characters'" />
          <testing v-if="selected.extra === 'testing'" />
          <unknowns v-if="selected.extra === 'unknowns'" />
        </div>

        <div v-else>
          <div class="q-my-md text-h4">
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
          <div class="text-body1 q-my-sm">
            Furthermore, if you connect via USB or Bluetooth HID and use keyboard emulation, then
            all the keyboard events will be shown on the right of this page.
          </div>
          <qr-code title="Enjoy" barcode="https://www.juit.com/" class="q-ma-xl" />
        </div>
      </q-page>
    </q-page-container>

    <q-footer elevated class="text-center" style="z-index: 99999999">
      Made with love in Berlin by <a style="color: white" href="https://www.juit.com/" target="_blank">Juit GmbH</a>
      (Source code on <a style="color: white" href="https://github.com/juitnow/juit-alacrity-setup" target="_blank">GitHub</a>)
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import Barcode from './barcode.vue'
import Bluetooth from './bluetooth.vue'
import CharsSpecial from './extras/chars-special.vue'
import DeviceName from './extras/device-name.vue'
import StripCharacters from './extras/strip-characters.vue'
import Testing from './extras/testing.vue'
import Unknowns from './extras/unknowns.vue'
import Keyboard from './keyboard.vue'
import QrCode from './qrcode.vue'
import Commands from './tree.vue'

import type { Command } from './commands'
import type { Keypress } from './keyboard.vue'

interface Barcode {
  barcode: string,
  hex: string,
}

const connected = ref<boolean>(true)
const selected = ref<Command | null>(null)
const barcodes = ref<Barcode[]>([])

watch(selected, () => window.scrollTo(0, 0))

function processBarcode(barcode: string, hex: string): void {
  // eslint-disable-next-line no-console
  console.log(`Scanned barcode "${barcode}" (${barcode.length}) [${hex}]`)
  barcodes.value.unshift({ barcode, hex })
  barcodes.value.splice(200)
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

const keyPresses = ref<Keypress[]>([])

function isModifier(event: KeyboardEvent): boolean {
  switch (event.code) {
    case 'AltLeft': return true
    case 'AltRight': return true
    case 'ControlLeft': return true
    case 'ControlRight': return true
    case 'MetaLeft': return true
    case 'MetaRight': return true
    case 'ShiftLeft': return true
    case 'ShiftRight': return true
    default: return false
  }
}

function onKeypress(event: KeyboardEvent): void {
  if (isModifier(event)) return

  const keyPress: Keypress = []
  if (event.ctrlKey) keyPress.push({ type: 'modifier', value: 'Ctrl' })
  if (event.altKey) keyPress.push({ type: 'modifier', value: 'Alt' })
  if (event.shiftKey) keyPress.push({ type: 'modifier', value: 'Shift' })
  if (event.metaKey) keyPress.push({ type: 'modifier', value: 'Meta' })
  keyPress.push({ type: 'key', value: event.code })
  keyPress.character = event.key
  keyPresses.value.unshift(keyPress)
  keyPresses.value.splice(200)
}

function onKeyup(event: KeyboardEvent): void {
  if (! isModifier(event)) return
  keyPresses.value.unshift([ { type: 'updown', value: `${event.code} UP` } ])
}

function onKeydown(event: KeyboardEvent): void {
  if (! isModifier(event)) return
  keyPresses.value.unshift([ { type: 'updown', value: `${event.code} DOWN` } ])
}

onMounted(() => {
  document.addEventListener('keypress', onKeypress)
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('keyup', onKeyup)
})
onUnmounted(() => {
  document.removeEventListener('keypress', onKeypress)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('keyup', onKeyup)
})
</script>
