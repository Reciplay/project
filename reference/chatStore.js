import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { sendChatMessage } from '@/utils/chat'

export const useChatStore = defineStore('chat', () => {
    const isChatOpen = ref(false)
    const selectedStyle = ref(null)
    const input = ref('')
    const messages = reactive([])
    const isLoading = ref(false) // ✅ 로딩 상태

    const toggleChat = () => {
        isChatOpen.value = !isChatOpen.value
    }

    const selectStyle = (styleKey) => {
        selectedStyle.value = styleKey
        messages.splice(0)
        input.value = ''
    }

    const sendMessage = async () => {
        if (!input.value.trim()) return

        const userMsg = input.value
        messages.push({ role: 'user', content: userMsg })
        input.value = ''

        isLoading.value = true
        messages.push({ role: 'assistant', content: '...' }) // ✅ 임시 로딩 메시지

        const style = selectedStyle.value || 'default'
        const response = await sendChatMessage(style, userMsg)

        // 로딩 메시지 삭제 + 실제 응답 추가
        messages.pop()
        messages.push({ role: 'assistant', content: response.answer })

        isLoading.value = false
    }
    const styles = {
        default: { name: '기본 챗봇', default: 'default' },
        loopy: { name: '잔망루피', default: 'loopy' },
        granny: { name: '욕쟁이 할머니', default: 'granny' },
        cat: { name: '나대는 고양이', default: 'cat' },
        assistant: { name: '상냥한 비서', default: 'assistant' },
        idol: { name: '하이텐션 아이돌', default: 'idol' },
        edgelord: { name: '중2병 천재', default: 'edgelord' },
        cold: { name: '시크한 상담사', default: 'cold' },
    }

    return {
        isChatOpen,
        selectedStyle,
        input,
        messages,
        isLoading,
        styles,
        toggleChat,
        selectStyle,
        sendMessage,
    }
})
