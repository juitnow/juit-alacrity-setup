<template>
  <q-input
    v-model="name"
    dense
    dark
    standout
    label="Device name (or prefix)"
    placeholder="Scanner"
    style="width: 300px;"
  >
    <template #append>
      <q-btn
        v-if="gatt?.connected"
        dense
        flat
        icon="sym_r_bluetooth"
        @click="disconnect()"
      />
      <q-btn
        v-else
        dense
        flat
        icon="sym_r_bluetooth"
        @click="connect()"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
/* eslint-disable no-console*/
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'

const emit = defineEmits<{
  (event: 'connected', value: boolean): void
  (event: 'battery', value: number | null): void
  (event: 'barcode', value: string, hex: string): void
}>()

/* ===== REACTIVITY AROUND DEVICE / GATT SERVER ============================= */

/** Our GATT server from the global "__bt_gatt" (for reloads) */
const gatt = shallowRef<BluetoothRemoteGATTServer | undefined>((globalThis as any)['__bt_gatt'])
/** The device name, if any */
const name = ref<string>(gatt.value?.device.name || '')

// Save the state of the connected GATT server as a global variable
watch(gatt, (gatt) => (globalThis as any)['__bt_gatt'] = gatt)
// Notify the parent on changes in connection and battery
watch(gatt, (gatt) => emit('connected', !! gatt?.connected), { immediate: true })
watch(gatt, updateBattery, { immediate: true })

/* ===== INTERVAL READING BATTERY LEVEL ===================================== */

/** Battery level (null for unknown) */
const battery = ref<number | null>(null)
/** Interval used for battery refreshing */
let batteryInterval = 0

/** Update the battery value reading from our GATT server */
function updateBattery(): void {
  if (! gatt.value?.connected) return emit('battery', null)

  gatt.value.getPrimaryService(batteryData).then(async (service) => {
    const characteristic = await service.getCharacteristic(batteryLevel)
    const data = await characteristic.readValue()
    emit('battery', data.getUint8(0))
  }).catch((error) => console.error('Error reading battery data', error))
}

// Emit battery levels changes only when needed
watch(battery, (battery) => emit('battery', battery), { immediate: true })
// Immediately update battery on GATT changes
watch(gatt, (_) => updateBattery, { immediate: true })

// Poll for battery changes every 30 seconds when this component is live
onMounted(() => batteryInterval = setInterval(updateBattery, 30_000))
onUnmounted(() => clearInterval(batteryInterval))

/* ===== ASYNCHRONOUS CONNECTION ============================================ */

const batteryData = BluetoothUUID.getService(0x180F)
const scannerData = BluetoothUUID.getService(0xFEEA)

const batteryLevel = BluetoothUUID.getCharacteristic(0x2A19)
const barcodeNotification = BluetoothUUID.getCharacteristic(0x2AA1)

// // Other characteristics (non relevant)
// const firmwareRevision = BluetoothUUID.getCharacteristic(0x2A26)
// const hardwareRevision = BluetoothUUID.getCharacteristic(0x2A27)
// const scannerUnknown1 = BluetoothUUID.getCharacteristic(0x2AA2) // r/w on scannerData
// const scannerUnknown2 = BluetoothUUID.getCharacteristic(0x2AA3) // r/o on batteryData

/** Connect asynchronously to a GATT server */
async function connectGattAsync(
    gatt?: BluetoothRemoteGATTServer,
): Promise<BluetoothRemoteGATTServer> {
  // Already connected? Simply return the same GATT server
  if (gatt?.connected) return gatt

  // Connect to the well-known GATT server or to a new device
  try {
    if (gatt) return await gatt.connect()

    const device = await navigator.bluetooth.requestDevice({
      filters: [ { namePrefix: name.value || 'Scanner' } ],
      optionalServices: [ batteryData, scannerData ],
    })

    // Update state when scanner disconnects
    device.ongattserverdisconnected = disconnect

    if (! device.gatt) {
      throw new Error(`Device "${device.name || '<???>'}" does not provide a GATT server`)
    } else {
      return await device.gatt.connect()
    }
  } catch (error) {
    if (! gatt) throw error
    console.error(`Error connecting to "${gatt.device.name || '<???>'}"`, error)
    return await connectGattAsync() // sans GATT
  }
}

/** Asynchronously open the GATT server's characteristics */
async function openCharacteristicsAsync(
    gatt: BluetoothRemoteGATTServer,
): Promise<BluetoothRemoteGATTServer> {
  if (! gatt.connected) throw new Error(`Device "${gatt.device.name || '<???>'}" not connected`)

  // const devinfo = BluetoothUUID.getService(0x180A)
  const services = await gatt.getPrimaryServices()
  console.log(`Device "${gatt.device.name || '<???>'}" has ${services.length} services`)
  for (const service of services) {
    console.log(`  Found service "${service.uuid}"`)
    const characteristics = await service.getCharacteristics()
    for (const characteristic of characteristics) {
      const capabilities: string[] = []
      if (characteristic.properties.authenticatedSignedWrites) capabilities.push('signedWrite')
      if (characteristic.properties.broadcast) capabilities.push('broadcast')
      if (characteristic.properties.indicate) capabilities.push('indicate')
      if (characteristic.properties.notify) capabilities.push('notify')
      if (characteristic.properties.read) capabilities.push('read')
      if (characteristic.properties.reliableWrite) capabilities.push('reliableWrite')
      if (characteristic.properties.writableAuxiliaries) capabilities.push('auxWrite')
      if (characteristic.properties.write) capabilities.push('write')
      if (characteristic.properties.writeWithoutResponse) capabilities.push('writeWithoutResponse')

      console.log(`  Found characteristic "${characteristic.uuid}" (${capabilities.join(', ')})`)
    }
  }

  // Initial battery level (on start)
  const batteryDataService = await gatt.getPrimaryService(batteryData)
  const batteryLevelCharacteristic = await batteryDataService.getCharacteristic(batteryLevel)
  emit('battery', (await batteryLevelCharacteristic.readValue()).getUint8(0))

  // Subscribe to barcode notifications from scanner
  const scannerDataService = await gatt.getPrimaryService(scannerData)
  const barcodeNotificationCharacteristic = await scannerDataService.getCharacteristic(barcodeNotification)

  barcodeNotificationCharacteristic.oncharacteristicvaluechanged = function() {
    const data = this.value
    if (! data) return console.warn('Barcode notification with no data')

    const array = new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
    const hex = [ ...array ].map((x) => ('00' + x.toString(16)).slice(-2)).join('')
    const barcode = [ ...array ].map((x) => String.fromCharCode(x)).join('')
    emit('barcode', barcode, hex)
  }
  barcodeNotificationCharacteristic.startNotifications()

  // All done
  return gatt
}

/* ===== CONNECT AND DISCONNECT ============================================= */

/** Connect (or re-connect) to a BLE barcode scanner */
function connect(): void {
  if (gatt.value) disconnect()

  console.log('Connecting...')
  connectGattAsync(gatt.value)
      .then((server) => openCharacteristicsAsync(server))
      .then((server) => {
        console.log(`Device "${server.device.name || '<???>'}" connected`)
        name.value = server.device.name || ''
        gatt.value = server
      })
      .catch((error) => console.error('Error connecting', error))
}

/** Ensure any BLE scanner is disconnected */
function disconnect(): void {
  console.log('Disconnecting...')
  try {
    if (gatt.value?.connected) gatt.value.disconnect()
  } finally {
    gatt.value = undefined
  }
}
</script>
