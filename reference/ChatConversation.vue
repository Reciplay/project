<template>
  <div class="chat-body">
    <div class="chat-header">
      <button
        class="back-btn"
        @click="ai.selectStyle(null)"
      >
        ←
      </button>
      <span class="bot-name">{{ botName }}</span>
    </div>

    <div
      class="chat-log"
      ref="logRef"
    >
      <div
        v-for="(msg, idx) in ai.messages"
        :key="idx"
        :class="['msg', msg.role]"
      >
        <div class="bubble">{{ msg.content }}</div>
      </div>
    </div>

    <div class="input-area">
      <input
        v-model="ai.input"
        @keydown.enter.prevent="handleEnter"
        @compositionstart="isComposing = true"
        @compositionend="isComposing = false"
        placeholder="메시지를 입력하세요..."
      />
    </div>
  </div>
</template>

<script setup>
import { useChatStore } from '@/stores/chatStore'
import { nextTick, ref, watch } from 'vue'

const ai = useChatStore()
const logRef = ref(null)
const isComposing = ref(false)

const handleEnter = () => {
  if (!isComposing.value) {
    ai.sendMessage()
  }
}
// 자동 스크롤
watch(
  () => ai.messages.length,
  async () => {
    await nextTick()
    const el = logRef.value
    if (el) el.scrollTop = el.scrollHeight
  },
)

const botNameMap = {
  default: '기본 챗봇',
  loopy: '잔망루피',
  granny: '욕쟁이 할머니',
  cat: '나대는 고양이',
  assistant: '상냥한 비서',
  idol: '하이텐션 아이돌',
  edgelord: '중2병 천재',
  cold: '시크한 상담사',
}
const botName = botNameMap[ai.selectedStyle]
</script>

<style scoped lang="scss">
.chat-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}

.chat-header {
  padding: 10px 16px;
  background: #f2f2f2;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.bot-name {
  font-size: 16px;
}

.chat-log {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scroll-behavior: smooth;
}

.msg {
  display: flex;

  &.user {
    justify-content: flex-end;
  }

  &.assistant {
    justify-content: flex-start;
  }
}

.bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 16px;
  background: #f0f0f0;
  white-space: pre-line;

  &.user {
    background: #007bff;
    color: white;
  }

  &.loading {
    font-style: italic;
    color: #aaa;
  }
}

.input-area {
  padding: 10px 16px;
  border-top: 1px solid #ddd;

  input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
}
</style>
