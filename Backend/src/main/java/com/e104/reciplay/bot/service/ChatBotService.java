package com.e104.reciplay.bot.service;

import com.e104.reciplay.bot.dto.request.LecturePreparation;
import com.e104.reciplay.bot.dto.response.GenerateTodoResponse;

public interface ChatBotService {
    void setLiveRoomChatbot();
    GenerateTodoResponse generateTodoList();
    void sendLectureInfo(LecturePreparation preparation);
}
