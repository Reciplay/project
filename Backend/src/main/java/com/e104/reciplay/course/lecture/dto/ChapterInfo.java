package com.e104.reciplay.course.lecture.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.util.List;

@Data
@NoArgsConstructor
@Builder
public class ChapterInfo {
    private Integer sequence;
    private String title;
    private List<TodoInfo> todos;

    @QueryProjection
    public ChapterInfo(Integer sequence, String title, List<TodoInfo> todos) {
        this.sequence = sequence;
        this.title = title;
        this.todos = todos;
    }
}
