package com.e104.reciplay.course.courses.dto.request.item;

import com.e104.reciplay.course.lecture.dto.TodoInfo;
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
    private Long id;
    private Integer sequence;
    private String title;
    private List<TodoInfo> todoList;
}
