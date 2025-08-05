package com.e104_2.reciplaywebsocket.room.service;

import com.e104_2.reciplaywebsocket.entity.Todo;
import com.e104_2.reciplaywebsocket.room.dto.response.ChapterTodoResponse;

import java.util.List;

public interface TodoQueryService {
    ChapterTodoResponse queryTodoOfChapter(Long lectureId, Integer chapterSequence);
}
