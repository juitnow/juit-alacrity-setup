<template>
  <div class="row justify-center">
    <div v-if="props.reset" class="text-center q-ma-lg">
      <div class="text-bold">
        Test / Reset
      </div>
      <qr-code
        barcode="1234567890"
        title="Test / Reset"
        :scale="4"
        class="q-ma-sm"
      />
    </div>
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
import { computed } from 'vue'

import QrCode from '../qrcode.vue'

import type { PropType } from 'vue'

interface Character {
  barcode: string,
  name: string,
}

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

const props = defineProps({
  // 0 => control characters
  // 1 => character set 0
  // 2 => character set 1
  // 3 => character set 2
  // 4 => character set 3
  // 5 => character set 4
  table: {
    type: Number as PropType<0 | 1 | 2 | 3 | 4 | 5>,
    required: false,
    default: 0,
  },
  // show test/reset
  reset: {
    type: Boolean,
    required: false,
    default: false,
  },
  // show prefix/suffix
  special: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const characters = computed<Character[]>(() => {
  const characters: Character[] = []
  for (const [ barcode, ...names ] of barcodes) {
    const name = names[props.table]
    if (name) characters.push({ barcode, name })
  }
  return characters
})
</script>
