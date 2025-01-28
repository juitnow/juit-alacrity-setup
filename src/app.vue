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
import { useQuasar } from 'quasar'
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

const { notify } = useQuasar()

interface Barcode {
  barcode: string,
  hex: string,
}

const connected = ref<boolean>(true)
const selected = ref<Command | null>(null)
const barcodes = ref<Barcode[]>([])

const toCheck = [
  '01765074721466',
  '01765074721475',
  '01765074721476',
  '01765074721483',
  '01765074721487',
  '01765074721490',
  '01765074721493',
  '01765074721494',
  '01765074721496',
  '01765074721503',
  '01765074721505',
  '01765074721507',
  '01765074721511',
  '01765074721514',
  '01765074721515',
  '01765074721521',
  '01765074721523',
  '01765074721524',
  '01765074721525',
  '01765074721527',
  '01765074721531',
  '01765074721536',
  '01765074721544',
  '01765074721545',
  '01765074721549',
  '01765074721551',
  '01765074721554',
  '01765074721568',
  '01765074721570',
  '01765074721571',
  '01765074721572',
  '01765074721576',
  '01765074721580',
  '01765074721807',
  '01765074721808',
  '01765074721823',
  '01765074721846',
  '01765074721847',
  '01765074721848',
  '01765074721853',
  '01765074721880',
  '01765074721885',
  '01765074721886',
  '01765074721887',
  '01765074721895',
  '01765074721897',
  '01765074721900',
  '01765074721902',
  '01765074721904',
  '01765074721906',
  '01765074721907',
  '01765074721910',
  '01765074721911',
  '01765074721914',
  '01765074721915',
  '01765074721918',
  '01765074721919',
  '01765074721922',
  '01765074721923',
  '01765074721926',
  '01765074721928',
  '01765074721929',
  '01765074721931',
  '01765074721933',
  '01765074721936',
  '01765074721938',
  '01765074721939',
  '01765074721940',
  '01765074721943',
  '01765074721946',
  '01765074721947',
  '01765074721949',
  '01765074721952',
  '01765074721953',
  '01765074721956',
  '01765074721957',
  '01765074721959',
  '01765074721962',
  '01765074721963',
  '01765074721965',
  '01765074721968',
  '01765074721970',
  '01765074721971',
  '01765074721973',
  '01765074721976',
  '01765074721977',
  '01765074721980',
  '01765074721982',
  '01765074721983',
  '01765074721986',
  '01765074721988',
  '01765074721989',
  '01765074721992',
  '01765074721993',
  '01765074721996',
  '01765074721998',
  '01765074721999',
  '01765074722002',
  '01765074722003',
  '01765074722005',
  'JD014600011963354336',
  'JD014600011964569618',
  'JD014600011964569643',
  'JD014600011964569649',
  'JD014600011964569756',
  'JD014600011964569765',
  'JD014600011964569770',
  'JD014600011964569775',
  'JD014600011964569788',
  'JD014600011964569797',
  'JD014600011964569811',
  'JD014600011964569818',
  'JD014600011964569822',
  'JD014600011964569843',
  'JD014600011964569864',
  'JD014600011964569883',
  'JD014600011964569899',
  'JD014600011964569911',
  'JD014600011964569913',
  'JD014600011964569925',
  'JD014600011964569928',
  'JD014600011964583840',
  'JD014600011964583842',
  'JD014600011964583844',
  'JD014600011964583853',
  'JD014600011964583894',
  'JD014600011964583896',
  'JD014600011964583905',
  'JD014600011964583908',
  'JD014600011964583912',
  'JD014600011964583921',
  'JD014600011964583924',
  'JD014600011964583981',
  'JD014600011964583985',
  'JD014600011964584006',
  'JD014600011964584009',
  'JD014600011964584010',
  'JD014600011964584015',
  'JD014600011964584016',
  'JD014600011964584019',
  'JD014600011964584023',
  'JD014600011964584075',
  'JD014600011964584081',
  'JD014600011964584136',
  'JD014600011964584141',
  'JD014600011964584150',
  'JD014600011964584167',
  'JD014600011964584175',
  'JD014600011964584181',
  'JD014600011964584190',
  'JD014600011964584197',
  'JD014600011965128683',
  'JD014600011965128780',
  'JD014600011965128795',
  'JD014600011965128798',
  'JD014600011965128807',
  'JD014600011965128812',
  'JD014600011965128814',
  'JD014600011965128823',
  'JD014600011965128834',
  'JD014600011965128895',
  'JD014600011965128901',
  'JD014600011965128908',
  'JD014600011965284911',
  'JD014600011965284928',
  'JD014600011965284929',
  'JD014600011965284935',
  'JD014600011965285001',
  'JD014600011965285006',
  'JD014600011965285018',
  'JD014600011965285022',
  'JD014600011965285108',
  'JD014600011965285112',
  'JD014600011965285122',
  'JD014600011965285124',
  'JD014600011965285131',
  'JD014600011965285132',
  'JD014600011965285134',
  'JD014600011965285153',
  'JD014600011965285287',
  'JD014600011965285291',
  'JD014600011965285299',
  'JD014600011965285310',
  'JD014600011965285320',
  'JD014600011965285327',
]

watch(selected, () => window.scrollTo(0, 0))

function processBarcode(barcode: string, hex: string): void {
  // eslint-disable-next-line no-console
  console.log(`Scanned barcode "${barcode}" (${barcode.length}) [${hex}]`)
  barcodes.value.unshift({ barcode, hex })
  barcodes.value.splice(200)

  let check = ''
  barcode = barcode.replaceAll(/[^0-9A-Za-z%]/g, '')
  if (barcode.match(/^%0\d{6}(\d{14})\d{6}/)) {
    check = barcode.substring(8, 22)
  } else if (barcode.match(/^JJD\d+$/)) {
    check = barcode.substring(1)
  }

  if (check && toCheck.includes(check)) {
    notify({
      message: `Bad barcode "${check}"`,
      color: 'negative',
      timeout: 10000,
    })
  } else {
    notify({
      message: `Good barcode "${check}"`,
      color: 'positive',
      timeout: 10000,
    })
  }
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
