export interface Command {
  section?: string,
  label: string,
  barcode?: string,
  description?: string[],
  reset?: boolean,
  extra?: 'device-name'
        | 'unknowns'
        | 'chars-special-0'
        | 'chars-special-1'
        | 'chars-special-2'
        | 'chars-special-3'
        | 'chars-special-4'
        | 'chars-special-5'
        | 'strip-characters'
}

export interface Node {
  id?: string,
  label: string,
  barcode?: string,
  description?: string[],
  children?: Node[],
  selectable?: boolean,
  section?: string,
  extra?: Command['extra']
  reset?: boolean,
}

/** Set of all known "%%SpecCode" barcodes */
export const knownCodes = new Set<string>()

/** Process our tree, assigning IDs and preparing a map of id => node */
function processTree(nodes: Node[], prefix: string = '', section?: string): Record<string, Node> {
  return nodes.reduce((map, node, i) => {
    if (node.barcode) knownCodes.add(node.barcode)

    node.id = `${prefix}${i}`
    node.selectable = (!! node.selectable) || (!! node.barcode)
    node.section = section
    map[node.id] = node

    const childSection = section ? `${section} / ${node.label}` : node.label

    return node.children ? {
      ...map,
      ...processTree(node.children, `${prefix}${i}.`, childSection ),
    } : map
  }, {} as Record<string, Node>)
}

/** The tree of all our commands */
export const tree: Node[] = [ {
  label: 'Reset Scanner',
  barcode: '%%SpecCode93',
  description: [
    'Reset the barcode scanner to the stored defaults',
    'The defaults can be saved using the "Save Settings" function',
  ],
}, {
  label: 'Device Name',
  barcode: '%%SpecCodeEC',
  extra: 'device-name',
  description: [
    'Scan this barcode to setup the device name for this scanner',
    'After scanning this code, the next barcode scanned will become the Bluetooth device name',
    'The device name should not be longer than 16 characters',
  ],
}, {
  label: 'Scanner Status',
  children: [
    { label: 'Bluetooth Name', barcode: '%%SpecCodeED',
      description: [ 'Scan a virtual barcode containing the current Bluetooth device name' ],
    },
    { label: 'Battery Level', barcode: '%%SpecCode15',
      description: [ 'Scan a virtual barcode containing the current battery level' ],
    },
    { label: 'Version Info', barcode: '%%SpecCode39',
      description: [ 'Scan a virtual barcode containing the current device version information' ],
    },
    { label: 'Timestamp', barcode: '%%SpecCode1B',
      description: [ 'Scan a virtual barcode containing the current device date and time information' ],
    },
  ],
}, {
  label: 'Connection',
  children: [
    { label: 'Bluetooth HID', barcode: '%%SpecCodeEA',
      description: [ 'Connect using Bluetooth HID (classic, keyboard emulation)' ],
    },
    { label: 'Bluetooth SPP', barcode: '%%SpecCodeAB',
      description: [ 'Connect using Bluetooth SPP (classic, serial port emulation)' ],
    },
    { label: 'Bluetooth BLE', barcode: '%%SpecCodeAC',
      description: [ 'Connect using Bluetooth LE (Bluetooth Low Energy)' ],
    },
    { label: 'Dongle Keyboard', barcode: '%%SpecCodeA8',
      description: [ 'Connect using the 2.4g USB dongle (keyboard emulation)' ],
    },
    { label: 'Dongle Serial', barcode: '%%SpecCodeAE',
      description: [ 'Connect using the 2.4g USB dongle (serial port emulation)' ],
    },
    { label: 'Pairing',
      children: [
        { label: 'Start Pairing', barcode: '%%SpecCode99',
          description: [ 'Enter pairing mode, either for Bluetooth classic or with the 2.4g USB dongle' ],
        },
        { label: 'Enable Button Pairing', barcode: '%%SpecCode79',
          description: [ 'Allow device pairing in Bluetooth HID mode when pressing the device button for 8 seconds' ],
        },
        { label: 'Disable Button Pairing', barcode: '%%SpecCode78',
          description: [ 'Forbid the use of the device button to initiate pairing in Bluetooth HID mode' ],
        },
      ],
    },
  ],
}, {
  label: 'Communication Speed',
  children: [
    { label: 'Fast', barcode: '%%SpecCodeB0',
      description: [ 'In keyboard emulation mode, send virtual keystrokes at fast speed' ],
    },
    { label: 'Medium', barcode: '%%SpecCodeB1',
      description: [ 'In keyboard emulation mode, send virtual keystrokes at medium speed' ],
    },
    { label: 'Slower', barcode: '%%SpecCodeB2',
      description: [ 'In keyboard emulation mode, send virtual keystrokes at slower speed' ],
    },
    { label: 'Slowest', barcode: '%%SpecCodeB3',
      description: [ 'In keyboard emulation mode, send virtual keystrokes at slowest speed' ],
    },
  ],
}, {
  label: 'Scanning Mode',
  children: [
    { label: 'Immediate Mode', barcode: '%%SpecCode10',
      description: [ 'Barcodes are transmitted to as soon as they are scanned' ],
    },
    { label: 'Inventory Mode',
      barcode: '%%SpecCode11',
      description: [ 'Scanned barcodes are stored in memory and transmitted only once the special "Upload Scanned Barcodes" barcode is scanned' ],
      children: [
        { label: 'Count Scanned Barcodes ', barcode: '%%SpecCode17',
          description: [ 'Scan a virtual barcode containing the total number of scanned barcodes in Inventory Mode' ],
        },
        { label: 'Upload Scanned Barcodes ', barcode: '%%SpecCode16',
          description: [ 'Upload all scanned barcodes scanned while in Inventory Mode' ],
        },
        { label: 'Delete Scanned Barcodes', barcode: '%%SpecCode18',
          description: [ 'Delete all scanned barcodes scanned while in Inventory Mode from memory' ],
        },
      ],
    },
  ],
}, {
  label: 'Barcode Termination',
  children: [
    { label: 'Add CR', barcode: '%%SpecCode9C',
      description: [ 'Append a single "CR" character (0x0D) after the scanned barcode' ],
    },
    { label: 'Add LF', barcode: '%%SpecCode9D',
      description: [ 'Append a single "LF" character (0x0A) after the scanned barcode' ],
    },
    { label: 'Add CR+LF', barcode: '%%SpecCode9E',
      description: [ 'Append the "CR+LF" character sequence (0x0D 0x0A) after the scanned barcode' ],
    },
    { label: 'No Termination', barcode: '%%SpecCode9F',
      description: [ 'Do not terminate the scanned barcode' ],
    },
  ],
}, {
  label: 'Case Conversion',
  children: [
    { label: 'No case conversion', barcode: '%%SpecCodeA5',
      description: [ 'Do not perform any case conversion' ],
    },
    { label: 'All lowercase', barcode: '%%SpecCodeA3',
      description: [ 'Convert all characters to lower case' ],
    },
    { label: 'All uppercase', barcode: '%%SpecCodeA4',
      description: [ 'Convert all characters to upper case' ],
    },
    { label: 'Case swap', barcode: '%%SpecCodeA6',
      description: [ 'Swap upper and lower case characters' ],
    },
  ],
}, {
  label: 'Keyboard Emulation',
  children: [
    { label: 'English (US)', barcode: '%%SpecCode40' },
    { label: 'Belgian', barcode: '%%SpecCode47' },
    { label: 'Croatian / Serbian', barcode: '%%SpecCode55' },
    { label: 'Czech', barcode: '%%SpecCode4D' },
    { label: 'Danish', barcode: '%%SpecCode53' },
    { label: 'Dutch', barcode: '%%SpecCode58' },
    { label: 'English (UK)', barcode: '%%SpecCode49' },
    { label: 'French', barcode: '%%SpecCode42' },
    { label: 'French (Canada)', barcode: '%%SpecCode5B' },
    { label: 'French (Switzerland)', barcode: '%%SpecCode57' },
    { label: 'German', barcode: '%%SpecCode41' },
    { label: 'German (Switzerland)', barcode: '%%SpecCode56' },
    { label: 'German (iOS)', barcode: '%%SpecCode4A' },
    { label: 'Hungarian', barcode: '%%SpecCode59' },
    { label: 'Italian', barcode: '%%SpecCode44' },
    { label: 'Italian (142 layout)', barcode: '%%SpecCode4E' },
    { label: 'Japanese', barcode: '%%SpecCode45' },
    { label: 'Norwegian', barcode: '%%SpecCode54' },
    { label: 'Polish', barcode: '%%SpecCode5A' },
    { label: 'Portuguese (Brazil)', barcode: '%%SpecCode4B' },
    { label: 'Portuguese (Portugal)', barcode: '%%SpecCode48' },
    { label: 'Russian', barcode: '%%SpecCode4C' },
    { label: 'Slovak', barcode: '%%SpecCode5D' },
    { label: 'Spanish', barcode: '%%SpecCode43' },
    { label: 'Spanish (Argentina and Latin America)', barcode: '%%SpecCode5C' },
    { label: 'Spanish (Mexico)', barcode: '%%SpecCode52' },
    { label: 'Swedish / Finnish', barcode: '%%SpecCode51' },
    { label: 'Thai', barcode: '%%SpecCode5E' },
    { label: 'Turkish (F layout)', barcode: '%%SpecCode50' },
    { label: 'Turkish (Q layout)', barcode: '%%SpecCode4F' },
    { label: 'International Universal', barcode: '%%SpecCode46' },
    { label: 'UTF Codes', barcode: '%%SpecCodeB4' },
  ],
}, {
  label: 'iOS Keyboard',
  children: [
    { label: 'Show iOS Keyboard', barcode: '%%SpecCode7B',
      description: [ 'When connected to iOS in HID mode, show the virtual keyboard on the iOS device' ],
    },
    { label: 'Hide iOS Keyboard', barcode: '%%SpecCode7A',
      description: [ 'When connected to iOS in HID mode, hide the virtual keyboard on the iOS device' ],
    },
    { label: 'Toggle iOS Keyboard', barcode: '%%SpecCode1A',
      description: [ 'When connected to iOS in HID mode, toggle the virtual keyboard on the iOS device' ],
    },
  ],
}, {
  label: 'Haptics',
  children: [
    { label: 'Sound OFF', barcode: '%%SpecCode94' },
    { label: 'Sound LOW', barcode: '%%SpecCode95' },
    { label: 'Sound MID', barcode: '%%SpecCode96' },
    { label: 'Sound ON', barcode: '%%SpecCode97' },
    { label: 'Tone LOW', barcode: '%%SpecCode7C' },
    { label: 'Tone HIGH', barcode: '%%SpecCode7D' },
    { label: 'Vibration OFF', barcode: '%%SpecCode76' },
    { label: 'Vibration ON', barcode: '%%SpecCode77' },

  ],
}, {
  label: 'Sleep Timeout',
  children: [
    { label: '30 seconds', barcode: '%%SpecCode30' },
    { label: '1 minute', barcode: '%%SpecCode31' },
    { label: '2 minutes', barcode: '%%SpecCode32' },
    { label: '5 minutes', barcode: '%%SpecCode33' },
    { label: '10 minutes', barcode: '%%SpecCode34' },
    { label: '30 minutes', barcode: '%%SpecCode35' },
    { label: 'Turn off sleep timeout', barcode: '%%SpecCode36' },
    { label: 'Initiate sleep NOW', barcode: '%%SpecCode38' },
  ],
}, {
  label: 'Prefix and Suffix Settings',
  children: [ {
    label: 'Set Prefix', barcode: '%%SpecCode9A', extra: 'chars-special-0', reset: true,
    description: [
      'Scan this barcode to set a custom prefix to emit before the barcode',
      'The prefix can be set by scanning one or more of the character barcodes listed below',
      'To reset the prefix, scan the above "Set Prefix" barcode, and immediately the "Test/Reset" barcode below',
    ],
  }, {
    label: 'Set Suffix', barcode: '%%SpecCode9B', extra: 'chars-special-0', reset: true,
    description: [
      'Scan this barcode to set a custom suffix to emit after the barcode',
      'The prefix can be set by scanning one or more of the character barcodes listed below',
      'To reset the prefix, scan the above "Set Prefix" barcode, and immediately the "Test/Reset" barcode below',
    ],
  }, {
    label: 'Timestamp',
    children: [
      { label: 'Timestamp prefix', barcode: '%%SpecCodeC1',
        description: [ 'Add the current timestamp at the beginning of the barcode' ],
      },
      { label: 'Timestamp suffix', barcode: '%%SpecCodeC2',
        description: [ 'Add the current timestamp at the end of the barcode' ],
      },
      {
        label: 'Disable timestamps', barcode: '%%SpecCodeC0',
        description: [ 'Do not add the timestamp to the barcode' ],
      },
    ],
  }, {
    label: 'Strip Characters',
    children: [
      { label: 'Strip prefix', barcode: '%%SpecCodeA0', extra: 'strip-characters', reset: true,
        description: [
          'Strip the specified number of characters from the beginning of the barcode',
          'To reset this setting, scan any normal barcode after scanning the one above',
        ],
      },
      { label: 'Strip suffix', barcode: '%%SpecCodeA1', extra: 'strip-characters', reset: true,
        description: [
          'Strip the specified number of characters from the end of the barcode',
          'To reset this setting, scan any normal barcode after scanning the one above',
        ],
      },
    ],
  }, {
    label: 'Special Characters',
    children: [
      { label: 'Character Set 0', barcode: '%%SpecCodeBA0000', extra: 'chars-special-1' },
      { label: 'Character Set 1', barcode: '%%SpecCodeBA0001', extra: 'chars-special-2' },
      { label: 'Character Set 2', barcode: '%%SpecCodeBA0002', extra: 'chars-special-3' },
      { label: 'Character Set 3', barcode: '%%SpecCodeBA0003', extra: 'chars-special-4' },
      { label: 'Character Set 4', barcode: '%%SpecCodeBA0004', extra: 'chars-special-5' },
    ],
  } ],
}, {
  label: 'GS/FNC1 Character',
  children: [
    { label: 'Convert GS character', barcode: '%%SpecCodeEF', extra: 'chars-special-0',
      description: [
        'Scan this barcode to enable transmission of the GS character (FNC1 in Code128)',
        'To select what control character should be associated with the GS character, scan one of the barcodes below',
      ],
    },
    { label: 'Strip GS character', barcode: '%%SpecCodeEE',
      description: [ 'Strip any occurrence of the GS character (FNC1 in Code128) from the barcode output' ],
    },
  ],
}, {
  label: 'Save Settings',
  barcode: '%%SpecCode92',
  description: [ 'Save the currently configured settings as default' ],
}, {
  label: 'Unknown Barcodes',
  description: [
    'These barcodes can potentially be valid, but no definitions of their',
    'functionality are available in the current documentation. USE AT YOUR OWN RISK!',
  ],
  extra: 'unknowns',
  selectable: true,
} ]

/** Map of all nodes by their ID */
export const nodes: Record<string, Node> = processTree(tree)

/** List of all unknown barcodes */
export const unknownCodes: string[] = []

for (let i = 0; i < 0x100; i ++) {
  const barcode = `%%SpecCode${i.toString(16).padStart(2, '0').toUpperCase()}`
  if (! knownCodes.has(barcode)) unknownCodes.push(barcode)
}
