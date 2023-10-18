import './assets/main.css'

import { createApp } from 'vue'
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'
import App from './App.vue'

const app = createApp(App)
app.use(VueMonacoEditorPlugin, {
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.38.0/min/vs'
  },
})

app.mount('#app')
