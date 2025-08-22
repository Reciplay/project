package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.repository.MessageRepository;
import com.e104.reciplay.entity.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessageManagementServiceImpl implements MessageManagementService {
    private final MessageRepository messageRepository;
    @Override
    public void createMessage(Long senderUserId, Long recevierUserId, String content) {
        Message message = new Message(senderUserId, recevierUserId, content);
        messageRepository.save(message);
    }
}
