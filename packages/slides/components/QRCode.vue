<script setup lang="ts">
import { computed } from 'vue'
import QrcodeVue from 'qrcode.vue'

const props = defineProps<{
  url?: string
  size?: number
}>()

const domain = import.meta.env.PUBLIC_DOMAIN || 'warsawjs.keanuharrell.com'
const qrUrl = computed(() => props.url || `https://${domain}`)
const qrSize = computed(() => props.size || 192)
</script>

<template>
  <div class="flex justify-center my-8">
    <div class="bg-white p-6 rounded-lg">
      <QrcodeVue
        :value="qrUrl"
        :size="qrSize"
        level="H"
      />
    </div>
  </div>
</template>
