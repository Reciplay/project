package com.e104.reciplay.admin.service;

public interface MessageManagementService {
    void createMessage(Long senderUserId, Long recevierUserId,String content);
}
