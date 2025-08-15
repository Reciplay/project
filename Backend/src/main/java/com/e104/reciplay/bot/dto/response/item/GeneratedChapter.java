package com.e104.reciplay.bot.dto.response.item;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GeneratedChapter {
    private String chapterName;
    private Integer sequence;
    private Integer numOfTodos;
    private List<GeneratedTodo> todos;
}
