package com.e104_2.reciplaywebsocket.room.service;

import com.e104_2.reciplaywebsocket.entity.Chapter;
import com.e104_2.reciplaywebsocket.entity.Todo;
import com.e104_2.reciplaywebsocket.room.dto.response.ChapterTodoResponse;
import com.e104_2.reciplaywebsocket.room.dto.response.item.TodoSummary;
import com.e104_2.reciplaywebsocket.room.repository.TodoRepository;
import com.e104_2.reciplaywebsocket.room.service.addtional.ChapterQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TodoQueryServiceImpl implements TodoQueryService{
    private final ChapterQueryService chapterQueryService;
    private final TodoRepository todoRepository;

    @Override
    public ChapterTodoResponse queryTodoOfChapter(Long lectureId, Integer chapterSequence) {
        log.debug("다음 챕터의 투두리스트를 검사합니다 {}, 챕터 = {}", lectureId, chapterSequence);
        Chapter chapter = chapterQueryService.queryChapterByLectureIdAndSequence(lectureId, chapterSequence);
        List<Todo> todos = todoRepository.findByChapterId(chapter.getId());

        ChapterTodoResponse response = new ChapterTodoResponse();
        response.setChapterName(chapter.getTitle());
        response.setChapterId(chapter.getId());
        response.setNumOfTodos(todos.size());
        response.setChapterSequence(chapter.getSequence());
        response.setTodos(todos.stream().map(TodoSummary::new).toList());

        log.debug("조회된 챕터 정보입니다. {}", response);
        response.setType("chapter-issue");
        return response;
    }
}
