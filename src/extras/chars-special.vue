<template>
  <div class="row justify-center">
    <q-btn-toggle
      v-model="characterSet"
      unelevated
      toggle-color="primary"
      style="border: 1px solid var(--q-primary)"
      :options="[
        { label: 'ASCII', value: '' },
        { label: 'CS 0', value: '0' },
        { label: 'CS 1', value: '1' },
        { label: 'CS 2', value: '2' },
        { label: 'CS 3', value: '3' },
        { label: 'CS 4', value: '4' },
      ]"
    />
  </div>
  <div v-if="characterSet" class="row justify-center q-my-md">
    <p class="q-my-xs">
      When using a character set other than <b>&nbsp;ASCII&nbsp;</b> scan the
      <b>&nbsp;Character Set {{ characterSet }}&nbsp;</b> barcode below <i>&nbsp;first&nbsp;</i>.
    </p>
    <p class="q-my-xs">
      Then scan the command barcode above to enter the setting.
    </p>
    <p class="q-my-xs">
      Finally scan one of the character barcodes below to apply the setting.
    </p>
  </div>
  <div v-else class="row justify-center q-my-md">
    <p class="q-my-xs">
      When using the <b>&nbsp;ASCII&nbsp;</b> please note that not all characters
      will work as expected.
    </p>
    <p class="q-my-xs">
      Characters outside the printable ASCII range and control characters will
      work over serial or BLE connection, but might not be transmitted when
      using keyboard emulation.
    </p>
    <p class="q-my-xs">
      If using keyboard emulation, please use one of the other character sets,
      as they will provide a more reliable output.
    </p>
  </div>
  <div class="row justify-center">
    <div v-if="characterSet" class="text-center q-ma-lg">
      <div class="text-bold">
        Character Set {{ characterSet }}
      </div>
      <qr-code
        :barcode="barcode"
        title="Character Set {{ tbl }}"
        :scale="5"
        class="q-ma-sm"
      />
    </div>
    <div class="text-center q-ma-lg">
      <div class="text-bold">
        Test / Reset
      </div>
      <qr-code
        barcode="1234567890ABCDEFGHIJKLM"
        title="Test / Reset"
        :scale="5"
        class="q-ma-sm"
      />
    </div>
  </div>
  <div class="row justify-center">
    <div v-for="(character, i) of characters" :key="i" class="text-center q-ma-lg">
      <div class="text-bold">
        {{ character.name }}
      </div>
      <qr-code
        :barcode="character.barcode"
        :title="character.name"
        :scale="4"
        class="q-ma-sm"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import QrCode from '../qrcode.vue'


interface Character {
  barcode: string,
  name: string,
}

const characterSet = ref<string>('')
const barcode = computed(() => {
  switch (characterSet.value) {
    case '0': return '%%SpecCodeBA0000'
    case '1': return '%%SpecCodeBA0001'
    case '2': return '%%SpecCodeBA0002'
    case '3': return '%%SpecCodeBA0003'
    case '4': return '%%SpecCodeBA0004'
    default: return ''
  }
})

/* eslint-disable @stylistic/no-multi-spaces */
const barcodes: [ string, string, ...(string | null)[] ][] = [
  [ '%%01', 'SOH', null,        'Home',        'Ctrl+A',    'Alt+001', 'Enter (keypad)' ],
  [ '%%02', 'STX', 'Ctrl+B',    'End',         'Ctrl+B',    'Alt+002', 'Caps Lock'      ],
  [ '%%03', 'ETX', 'Ctrl+C',    'Up Arrow',    'Ctrl+C',    'Alt+003', 'Right Arrow'    ],
  [ '%%04', 'EOT', null,        'Down Arrow',  'Ctrl+D',    'Alt+004', 'Up Arrow'       ],
  [ '%%05', 'ENQ', null,        'Left Arrow',  'Ctrl+E',    'Alt+005'                   ],
  [ '%%06', 'ACK', null,        'Right Arrow', 'Ctrl+F',    'Alt+006'                   ],
  [ '%%07', 'BEL', null,        'Shift+Tab',   'Ctrl+G',    'Alt+007', 'Enter'          ],
  [ '%%08', 'BS',  'Backspace', 'Backspace',   'Backspace', 'Alt+008', 'Left Arrow'     ],
  [ '%%09', 'HT',  'Tab',       'Tab',         'Tab',       'Alt+009', 'Tab'            ],
  [ '%%0A', 'LF',  'Enter',     'Enter',       'Ctrl+P',    'Alt+010', 'Down Arrow'     ],
  [ '%%0B', 'VT',  null,        null,          'Ctrl+Q',    'Alt+011', 'Tab'            ],
  [ '%%0C', 'FF',  null,        null,          'Ctrl+R',    'Alt+012', 'Delete'         ],
  [ '%%0D', 'CR',  'Enter',     'Enter',       'Enter',     'Alt+013', 'Enter'          ],
  [ '%%0E', 'SO',  'F1',        'Page Up',     'Ctrl+N',    'Alt+014', 'Insert'         ],
  [ '%%0F', 'SI',  'F2',        'Page Down',   'Ctrl+O',    'Alt+015', 'Esc'            ],
  [ '%%10', 'DLE', 'F3',        'F11',         'Ctrl+P',    'Alt+016', 'F11'            ],
  [ '%%11', 'DC1', 'F4',        null,          'Ctrl+Q',    'Alt+017', 'Home'           ],
  [ '%%12', 'DC2', 'F5',        null,          'Ctrl+R',    'Alt+018', 'Print Screen'   ],
  [ '%%13', 'DC3', 'F6',        null,          'Ctrl+S',    'Alt+019', 'Backspace'      ],
  [ '%%14', 'DC4', 'F7',        null,          'Ctrl+T',    'Alt+020', 'Shift+Tab'      ],
  [ '%%15', 'NAK', 'F8',        'F12',         'Ctrl+U',    'Alt+021', 'F12'            ],
  [ '%%16', 'SYN', 'F9',        'F1',          'Ctrl+V',    'Alt+022', 'F1'             ],
  [ '%%17', 'ETB', 'F10',       'F2',          'Ctrl+W',    'Alt+023', 'F2'             ],
  [ '%%18', 'CAN', 'F11',       'F3',          'Ctrl+X',    'Alt+024', 'F3'             ],
  [ '%%19', 'EM',  'F12',       'F4',          'Ctrl+Y',    'Alt+025', 'F4'             ],
  [ '%%1A', 'SUB', null,        'F5',          'Ctrl+Z',    'Alt+026', 'F5'             ],
  [ '%%1B', 'ESC', 'ESC',       'F6',          'Ctrl+[',    'Alt+027', 'F6'             ],
  [ '%%1C', 'FS',  'Alt+028',   'F7',          'Ctrl+\\',   'Alt+028', 'F7'             ],
  [ '%%1D', 'GS',  'Alt+029',   'F8',          'Ctrl+]',    'Alt+029', 'F8'             ],
  [ '%%1E', 'RS',  null,        'F9',          'Ctrl+^',    'Alt+030', 'F9'             ],
  [ '%%1F', 'US',  null,        'F10',         'Ctrl+_',    'Alt+031', 'F10'            ],
  [ '%%20', 'SPC'                                                                       ],
]

for (let i = 0x21; i < 0x7F; i ++) barcodes.push([ `%%${i.toString(16).toUpperCase()}`, String.fromCharCode(i) ])
barcodes.push([ '%%7F', 'DEL' ])
barcodes.push([ '%%A0', 'NBSP' ])
for (let i = 0xA1; i < 0xAD; i ++) barcodes.push([ `%%${i.toString(16).toUpperCase()}`, String.fromCharCode(i) ])
barcodes.push([ '%%AD', 'SHY' ])
for (let i = 0xAE; i < 0xFF; i ++) barcodes.push([ `%%${i.toString(16).toUpperCase()}`, String.fromCharCode(i) ])

const characters = computed<Character[]>(() => {
  const characters: Character[] = []
  const index = characterSet.value === '0' ? 1 :
    characterSet.value === '1' ? 2 :
    characterSet.value === '2' ? 3 :
    characterSet.value === '3' ? 4 :
    characterSet.value === '4' ? 5 :
    0
  for (const [ barcode, ...names ] of barcodes) {
    const name = names[index]
    if (name) characters.push({ barcode, name })
  }
  return characters
})
</script>
