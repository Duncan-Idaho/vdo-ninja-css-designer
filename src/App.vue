<script setup lang="ts">
import { DragCol } from "vue-resizer";
import VueMonacoEditor from '@guolao/vue-monaco-editor'
import { computed, ref, watch } from "vue";
import { useClipboard, useDebounce, useStorage } from "@vueuse/core";

const url = useStorage('url', 'https://vdo.ninja/?director=' + crypto.randomUUID())
const debouncedUrl = useDebounce(url, 500)
const iframeUrl = ref(url)
const iframe = ref<HTMLIFrameElement | null>(null)

watch(debouncedUrl, async value => {
  if (!iframe.value)
    return

  iframe.value.contentWindow?.postMessage({
    "reload": true
  }, '*');

  await new Promise(resolve => setTimeout(resolve, 5))
  iframeUrl.value = value
})

const parsedUrl = computed({
  get: () => {
    const [target, queryString] = url.value.split('?', 2)
    const params = queryString?.split('&') ?? []
    return {
      target,
      params: params.map(param => param.split('='))
    }
  },
  set: value => {
    const paramsString = value.params
      .map(param => param.join('='))
      .join('&')
    url.value = `${value.target}?${paramsString}`
  }
})

const css = computed({
  get: () => {
    const base64css = parsedUrl.value.params.find(param => param[0] === 'base64css')?.[1] ?? ''
    return decodeURIComponent(window.atob(base64css))
  },
  set: value => {
    const base64css = window.btoa(encodeURIComponent(value))

    parsedUrl.value = {
      target: parsedUrl.value.target,
      params: replaceParamInArray('base64css', base64css)
    }

    function replaceParamInArray(key: string, value: string) {
      const newParam = [key, value]

      let hasBeenFound = false
      const params = parsedUrl.value.params
        .map(replaceParam)

      if (!hasBeenFound)
        params.push(newParam)

      return params

      function replaceParam(param: string[]) {
        if (param[0] !== 'base64css')
          return param

        hasBeenFound = true
        return newParam
      }
    }
  }
})

const isDragging = ref(false)

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
}

const { copy } = useClipboard({ source: url })
</script>

<template>
  <header>
    <button @click="() => copy(url)" class="copy">📋</button>
    <label for="url">
      VDO.Ninja URL: 
    </label>
    <input id="url" type="text" v-model="url" />
  </header>

  <main>
    <DragCol
      :left-percent="50"
      width="100%"
      height="100%"
      :slider-width="8"
      @isDragging="(value: boolean) => isDragging = value"
    >
      <template #left>
        <vue-monaco-editor
          v-model:value="css"
          theme="vs-dark"
          :options="MONACO_EDITOR_OPTIONS"
          language="css"
        />
      </template>
      <template #right>
        <iframe 
          v-if="!isDragging"
          :src="iframeUrl"
          allow="autoplay;camera;microphone;fullscreen;picture-in-picture;display-capture;midi;geolocation;" 
        ></iframe>
      </template>
    </DragCol>
  </main>
</template>

<style scoped>
main {
  height: 100%;
  color: var(--color-text);
}

header {
  line-height: 1.5;
  display: flex;
  margin-bottom: 1em;
  font-size: 1.2em;
  gap: 0.3em;
}

iframe {
  width: 100%;
  height: 100%;
}

label {
  font-weight: bold;
}

input {
  font-size: 1.2em;
  flex: 1;
}
</style>