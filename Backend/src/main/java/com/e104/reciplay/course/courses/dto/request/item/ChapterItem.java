package com.e104.reciplay.course.courses.dto.request.item;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChapterItem {
    private Integer sequence;
    private String title;
    private List<TodoItem> todoList;
}
