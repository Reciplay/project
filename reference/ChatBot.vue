<template>
  <div class="chatbot-wrapper">
    <ChatStyleSelector v-if="!ai.selectedStyle" />
    <ChatConversation v-else />
  </div>
</template>

<script setup>
import { useChatStore } from '@/stores/chatStore'
import ChatConversation from './ChatConversation.vue'
import ChatStyleSelector from './ChatStyleSelector.vue'

const ai = useChatStore()

const styles = ai.styles
</script>

<style scoped lang="scss">
.chatbot-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%; // <- 꼭 필요!
  overflow-y: auto; // 스크롤 가능하게
}
</style>
