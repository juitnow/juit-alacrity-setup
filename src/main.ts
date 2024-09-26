// Quasar styles and extras
import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css'
import { Dialog, Notify, Quasar } from 'quasar'
import iconSet from 'quasar/icon-set/material-symbols-rounded'
import 'quasar/src/css/flex-addon.sass'
import 'quasar/src/css/index.sass'
import { createApp } from 'vue'

// Our CSS files
import App from './app.vue'

import '@/assets/fonts.css'
import '@/styles.scss'

/* ========================================================================== *
 * Initialize and mount app                                                   *
 * ========================================================================== */

// Create and initialize app
createApp(App)
    .use(Quasar, {
      config: { loading: { delay: 500 } },
      plugins: { Dialog, Notify }, // quasar plugins
      iconSet, // material symbols rounded everywhere
    })
    .mount('#app')
