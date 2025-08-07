package com.e104_2.reciplaywebsocket.room.dto.response;

import com.e104_2.reciplaywebsocket.room.dto.response.item.TodoSummary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChapterTodoResponse {
    private String type;
    private Long chapterId;
    private String chapterName;
    private Integer chapterSequence;
    private Integer numOfTodos;
    private List<TodoSummary> todos;
}
