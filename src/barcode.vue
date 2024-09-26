<template>
  <div class="barcode">
    <span v-for="(chunk, i) of chunks" :key="i" :class="`chunk-${chunk.type}`">
      {{ chunk.value }}
    </span>
    <q-tooltip v-if="props.hex">
      {{ props.hex }}
    </q-tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Chunk {
  type: 'text' | 'control' | 'special',
  value: string,
}

const props = defineProps({
  barcode: {
    type: String,
    required: true,
    default: '',
  },
  hex: {
    type: String,
    required: false,
    default: '',
  },
})

const chunks = computed((): Chunk[] => {
  const chunks: Chunk[] = []

  let chunk: Chunk = { type: 'text', value: '' }
  for (let i = 0; i < props.barcode.length; i ++) {
    const char = props.barcode.codePointAt(i)!
    if (char > 0xffff) i++ // extended code points..

    // regular characters, added to the current chunk...
    if ((((char >= 0x20) && (char <= 0x7E)) || ((char >= 0xA1) && (char <= 0xFF))) && (char != 0xAD)) {
      chunk.value += props.barcode[i]
      continue
    }

    // any other character deserve another chunk...
    if (chunk.value) chunks.push(chunk)

    // control and special characters
    switch (char) {
      case 0x00: chunk = { type: 'control', value: 'NUL' }; break
      case 0x01: chunk = { type: 'control', value: 'SOH' }; break
      case 0x02: chunk = { type: 'control', value: 'STX' }; break
      case 0x03: chunk = { type: 'control', value: 'ETX' }; break
      case 0x04: chunk = { type: 'control', value: 'EOT' }; break
      case 0x05: chunk = { type: 'control', value: 'ENQ' }; break
      case 0x06: chunk = { type: 'control', value: 'ACK' }; break
      case 0x07: chunk = { type: 'control', value: 'BEL' }; break
      case 0x08: chunk = { type: 'control', value: 'BS' }; break
      case 0x09: chunk = { type: 'control', value: 'HT' }; break
      case 0x0A: chunk = { type: 'control', value: 'LF' }; break
      case 0x0B: chunk = { type: 'control', value: 'VT' }; break
      case 0x0C: chunk = { type: 'control', value: 'FF' }; break
      case 0x0D: chunk = { type: 'control', value: 'CR' }; break
      case 0x0E: chunk = { type: 'control', value: 'SO' }; break
      case 0x0F: chunk = { type: 'control', value: 'SI' }; break
      case 0x10: chunk = { type: 'control', value: 'DLE' }; break
      case 0x11: chunk = { type: 'control', value: 'DC1' }; break
      case 0x12: chunk = { type: 'control', value: 'DC2' }; break
      case 0x13: chunk = { type: 'control', value: 'DC3' }; break
      case 0x14: chunk = { type: 'control', value: 'DC4' }; break
      case 0x15: chunk = { type: 'control', value: 'NAK' }; break
      case 0x16: chunk = { type: 'control', value: 'SYN' }; break
      case 0x17: chunk = { type: 'control', value: 'ETB' }; break
      case 0x18: chunk = { type: 'control', value: 'CAN' }; break
      case 0x19: chunk = { type: 'control', value: 'EM' }; break
      case 0x1A: chunk = { type: 'control', value: 'SUB' }; break
      case 0x1B: chunk = { type: 'control', value: 'ESC' }; break
      case 0x1C: chunk = { type: 'control', value: 'FS' }; break
      case 0x1D: chunk = { type: 'control', value: 'GS' }; break
      case 0x1E: chunk = { type: 'control', value: 'RS' }; break
      case 0x1F: chunk = { type: 'control', value: 'US' }; break
      case 0x7F: chunk = { type: 'control', value: 'DEL' }; break
      case 0xA0: chunk = { type: 'control', value: 'NBSP' }; break
      case 0xAD: chunk = { type: 'control', value: 'SHY' }; break
      default: chunk = {
        value: '\\x' + char.toString(16).padStart(char < 0x100 ? 2 : char < 0x10000 ? 4 : 6, '0'),
        type: 'special',
      }
    }

    // Push the control/special chunk
    chunks.push(chunk)

    // Recreate new chunk for the next text
    chunk = { type: 'text', value: '' }
  }

  if (chunk.value) chunks.push(chunk)
  return chunks
})
</script>

<style lang="css" scoped>
  .barcode {
    background-color: rgba(191, 191, 191, 0.25);
    border: 1px solid rgba(191, 191, 191);
    border-radius: 4px;
    padding: 2px 2px;
    margin: 3px 0px;
    font-family: monospace;
    font-size: 0.8em;
  }

  .chunk-text {
    border: 1px solid transparent;
    border-radius: 2px;
    padding: 0px 1px;
    margin: 0px 1px;
  }

  .chunk-control {
    background-color: rgba(0, 127, 0, 0.25);
    border: 1px solid rgb(0, 127, 0);
    border-radius: 2px;
    padding: 0px 1px;
    margin: 0px 1px;
  }

  .chunk-special {
    background-color: rgba(0, 0, 255, 0.25);
    border: 1px solid rgb(0, 0, 255);
    border-radius: 2px;
    padding: 0px 1px;
    margin: 0px 1px;
  }
</style>
