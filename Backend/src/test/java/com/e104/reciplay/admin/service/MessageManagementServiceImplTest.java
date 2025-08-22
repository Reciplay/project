package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.repository.MessageRepository;
import com.e104.reciplay.entity.Message;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MessageManagementServiceImplTest {

    @Mock
    MessageRepository messageRepository;

    @InjectMocks
    MessageManagementServiceImpl service;

    @Test
    @DisplayName("createMessage: Message 생성 후 repository.save 호출 및 필드값 검증")
    void createMessage_savesWithCorrectFields() {
        // given
        Long senderId = 100L;
        Long receiverId = 200L;
        String content = "안녕하세요! 승인되었습니다.";

        // save 동작 자체는 void-like로 검증하되 반환값은 사용 안 하므로 스텁 불필요
        ArgumentCaptor<Message> captor = ArgumentCaptor.forClass(Message.class);

        // when
        service.createMessage(senderId, receiverId, content);

        // then
        verify(messageRepository, times(1)).save(captor.capture());
        Message saved = captor.getValue();

        assertNotNull(saved, "저장되는 Message가 null이면 안 됩니다.");
        assertEquals(senderId, saved.getSenderId());
        assertEquals(receiverId, saved.getReceiverId());
        assertEquals(content, saved.getContent());

        verifyNoMoreInteractions(messageRepository);
    }

    @Test
    @DisplayName("createMessage: 빈 문자열/널도 그대로 저장 시도(검증 로직 없음)")
    void createMessage_allowsNullOrEmptyContent() {
        Long senderId = 1L;
        Long receiverId = 2L;

        // when
        service.createMessage(senderId, receiverId, null);
        service.createMessage(senderId, receiverId, "");

        // then
        ArgumentCaptor<Message> captor = ArgumentCaptor.forClass(Message.class);
        verify(messageRepository, times(2)).save(captor.capture());

        // 두 번 저장된 메시지 각각 확인
        Message first = captor.getAllValues().get(0);
        Message second = captor.getAllValues().get(1);

        assertNull(first.getContent(), "첫 번째 메시지는 content가 null이어야 합니다.");
        assertEquals("", second.getContent(), "두 번째 메시지는 content가 빈 문자열이어야 합니다.");
        assertEquals(senderId, first.getSenderId());
        assertEquals(receiverId, first.getReceiverId());
        assertEquals(senderId, second.getSenderId());
        assertEquals(receiverId, second.getReceiverId());

        verifyNoMoreInteractions(messageRepository);
    }
}
