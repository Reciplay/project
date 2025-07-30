package com.e104.reciplay.course.lecture.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChapterInfo {
    private Integer sequence;
    private String title;
    private List<TodoInfo> todos;
}
