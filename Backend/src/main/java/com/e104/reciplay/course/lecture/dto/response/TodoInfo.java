package com.e104.reciplay.course.lecture.dto.response;

import com.e104.reciplay.common.types.TodoType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TodoInfo {
    private Integer sequence;
    private String title;
    private TodoType type;
    private Integer seconds;
}
