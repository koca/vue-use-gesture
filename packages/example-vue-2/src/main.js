import Vue from 'vue'
import App from './use-drag.vue'
import VueCompositionAPI from '@vue/composition-api'

Vue.use(VueCompositionAPI)

import 'tailwindcss/dist/tailwind.min.css'
Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
}).$mount('#app')
