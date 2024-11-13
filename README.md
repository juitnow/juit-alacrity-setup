# Alacrity Barcode Scanner Configuration

A little web interface to configure Alacrity barcode scanners.

See it live [here](https://juitnow.github.io/juit-alacrity-setup/).

#### Known commands

* _`%%SpecCode00`_ ... _`%%SpecCode0F`_: **Unknown**
* `%%SpecCode10`: Scanning Mode / Immediate Mode
* `%%SpecCode11`: Scanning Mode / Inventory Mode
* _`%%SpecCode12`_ ... _`%%SpecCode14`_: **Unknown**
* `%%SpecCode15`: Scanner Status / Battery Level
* `%%SpecCode16`: Scanning Mode / Inventory Mode / Upload Scanned Barcodes
* `%%SpecCode17`: Scanning Mode / Inventory Mode / Count Scanned Barcodes
* `%%SpecCode18`: Scanning Mode / Inventory Mode / Delete Scanned Barcodes
* _`%%SpecCode19`_: **Unknown**
* `%%SpecCode1A`: iOS Keyboard / Toggle iOS Keyboard
* `%%SpecCode1B`: Scanner Status / Timestamp
* _`%%SpecCode1C`_ ... _`%%SpecCode2F`_: **Unknown**
* `%%SpecCode30`: Sleep Timeout / 30 seconds
* `%%SpecCode31`: Sleep Timeout / 1 minute
* `%%SpecCode32`: Sleep Timeout / 2 minutes
* `%%SpecCode33`: Sleep Timeout / 5 minutes
* `%%SpecCode34`: Sleep Timeout / 10 minutes
* `%%SpecCode35`: Sleep Timeout / 30 minutes
* `%%SpecCode36`: Sleep Timeout / Turn off sleep timeout
* _`%%SpecCode37`_: **Unknown**
* `%%SpecCode38`: Sleep Timeout / Initiate sleep NOW
* `%%SpecCode39`: Scanner Status / Version Info
* _`%%SpecCode3A`_ ... _`%%SpecCode3F`_: **Unknown**
* `%%SpecCode40`: Keyboard Emulation / English (US)
* `%%SpecCode41`: Keyboard Emulation / German
* `%%SpecCode42`: Keyboard Emulation / French
* `%%SpecCode43`: Keyboard Emulation / Spanish
* `%%SpecCode44`: Keyboard Emulation / Italian
* `%%SpecCode45`: Keyboard Emulation / Japanese
* `%%SpecCode46`: Keyboard Emulation / International Universal
* `%%SpecCode47`: Keyboard Emulation / Belgian
* `%%SpecCode48`: Keyboard Emulation / Portuguese (Portugal)
* `%%SpecCode49`: Keyboard Emulation / English (UK)
* `%%SpecCode4A`: Keyboard Emulation / German (iOS)
* `%%SpecCode4B`: Keyboard Emulation / Portuguese (Brazil)
* `%%SpecCode4C`: Keyboard Emulation / Russian
* `%%SpecCode4D`: Keyboard Emulation / Czech
* `%%SpecCode4E`: Keyboard Emulation / Italian (142 layout)
* `%%SpecCode4F`: Keyboard Emulation / Turkish (Q layout)
* `%%SpecCode50`: Keyboard Emulation / Turkish (F layout)
* `%%SpecCode51`: Keyboard Emulation / Swedish / Finnish
* `%%SpecCode52`: Keyboard Emulation / Spanish (Mexico)
* `%%SpecCode53`: Keyboard Emulation / Danish
* `%%SpecCode54`: Keyboard Emulation / Norwegian
* `%%SpecCode55`: Keyboard Emulation / Croatian / Serbian
* `%%SpecCode56`: Keyboard Emulation / German (Switzerland)
* `%%SpecCode57`: Keyboard Emulation / French (Switzerland)
* `%%SpecCode58`: Keyboard Emulation / Dutch
* `%%SpecCode59`: Keyboard Emulation / Hungarian
* `%%SpecCode5A`: Keyboard Emulation / Polish
* `%%SpecCode5B`: Keyboard Emulation / French (Canada)
* `%%SpecCode5C`: Keyboard Emulation / Spanish (Argentina and Latin America)
* `%%SpecCode5D`: Keyboard Emulation / Slovak
* `%%SpecCode5E`: Keyboard Emulation / Thai
* _`%%SpecCode5F`_ ... _`%%SpecCode75`_: **Unknown**
* `%%SpecCode76`: Haptics / Vibration OFF
* `%%SpecCode77`: Haptics / Vibration ON
* `%%SpecCode78`: Connection / Pairing / Disable Button Pairing
* `%%SpecCode79`: Connection / Pairing / Enable Button Pairing
* `%%SpecCode7A`: iOS Keyboard / Hide iOS Keyboard
* `%%SpecCode7B`: iOS Keyboard / Show iOS Keyboard
* `%%SpecCode7C`: Haptics / Tone LOW
* `%%SpecCode7D`: Haptics / Tone HIGH
* _`%%SpecCode7E`_ ... _`%%SpecCode91`_: **Unknown**
* `%%SpecCode92`: Save Settings
* `%%SpecCode93`: Reset Scanner
* `%%SpecCode94`: Haptics / Sound OFF
* `%%SpecCode95`: Haptics / Sound LOW
* `%%SpecCode96`: Haptics / Sound MID
* `%%SpecCode97`: Haptics / Sound ON
* _`%%SpecCode98`_ : **Unknown**
* `%%SpecCode99`: Connection / Pairing / Start Pairing
* `%%SpecCode9A`: Prefix and Suffix Settings / Set Prefix
* `%%SpecCode9B`: Prefix and Suffix Settings / Set Suffix
* `%%SpecCode9C`: Barcode Termination / Add CR
* `%%SpecCode9D`: Barcode Termination / Add LF
* `%%SpecCode9E`: Barcode Termination / Add CR+LF
* `%%SpecCode9F`: Barcode Termination / No Termination
* `%%SpecCodeA0`: Prefix and Suffix Settings / Strip Characters / Strip prefix
* `%%SpecCodeA1`: Prefix and Suffix Settings / Strip Characters / Strip suffix
* _`%%SpecCodeA2`_: **Unknown**
* `%%SpecCodeA3`: Case Conversion / All lowercase
* `%%SpecCodeA4`: Case Conversion / All uppercase
* `%%SpecCodeA5`: Case Conversion / No case conversion
* `%%SpecCodeA6`: Case Conversion / Case swap
* _`%%SpecCodeA7`_: **Unknown**
* `%%SpecCodeA8`: Connection / Dongle Keyboard
* _`%%SpecCodeA9`_ ... _`%%SpecCodeAA`_: **Unknown**
* `%%SpecCodeAB`: Connection / Bluetooth SPP
* `%%SpecCodeAC`: Connection / Bluetooth BLE
* `%%SpecCodeAE`: Connection / Dongle Serial
* _`%%SpecCodeAF`_: **Unknown**
* `%%SpecCodeB0`: Communication Speed / Fast
* `%%SpecCodeB1`: Communication Speed / Medium
* `%%SpecCodeB2`: Communication Speed / Slower
* `%%SpecCodeB3`: Communication Speed / Slowest
* `%%SpecCodeB4`: Keyboard Emulation / UTF Codes
* _`%%SpecCodeB5`_ ... _`%%SpecCodeB9`_: **Unknown**
* `%%SpecCodeBA0000`: Prefix and Suffix Settings / Special Characters / Character Set 0
* `%%SpecCodeBA0001`: Prefix and Suffix Settings / Special Characters / Character Set 1
* `%%SpecCodeBA0002`: Prefix and Suffix Settings / Special Characters / Character Set 2
* `%%SpecCodeBA0003`: Prefix and Suffix Settings / Special Characters / Character Set 3
* `%%SpecCodeBA0004`: Prefix and Suffix Settings / Special Characters / Character Set 4
* _`%%SpecCodeBB`_ ... _`%%SpecCodeBF`_: **Unknown**
* `%%SpecCodeC0`: Prefix and Suffix Settings / Timestamp / Disable timestamps
* `%%SpecCodeC1`: Prefix and Suffix Settings / Timestamp / Timestamp prefix
* `%%SpecCodeC2`: Prefix and Suffix Settings / Timestamp / Timestamp suffix
* _`%%SpecCodeC3`_ ... _`%%SpecCodeE9`_: **Unknown**
* `%%SpecCodeEA`: Connection / Bluetooth HID
* _`%%SpecCodeEB`_: **Unknown**
* `%%SpecCodeEC`: Device Name
* `%%SpecCodeED`: Scanner Status / Bluetooth Name
* `%%SpecCodeEE`: GS/FNC1 Character / Strip GS character
* `%%SpecCodeEF`: GS/FNC1 Character / Convert GS character
* _`%%SpecCodeF0`_ ... _`%%SpecCodeFF`_: **Unknown**
