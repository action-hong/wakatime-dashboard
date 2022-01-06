<script setup lang="ts">
const name = useLocalStorage('GIST_ID', 'f0d203a99a71df04685c8d3040a90fd5')

const router = useRouter()
const go = () => {
  if (name.value)
    router.push('/dashboard')
}
</script>

<template>
  <div text="center">
    <div i-carbon-campsite text-4xl inline-block />
    <p>
      <a rel="noreferrer" href="https://github.com/action-hong/wakatime-sync" target="_blank">
        Wakatime Dashboard
      </a>
    </p>

    <div py-4 />

    <input
      id="input"
      v-model="name"
      placeholder="What's your gistId?"
      type="text"
      autocomplete="false"
      p="x-4 y-2"
      w="250px"
      text="center"
      bg="transparent"
      border="~ rounded gray-200 dark:gray-700"
      outline="none active:none"
      @keydown.enter="go"
    >

    <div>
      <button
        class="m-3 text-sm btn"
        :disabled="!name"
        @click="go"
      >
        Go
      </button>
    </div>
  </div>
</template>
