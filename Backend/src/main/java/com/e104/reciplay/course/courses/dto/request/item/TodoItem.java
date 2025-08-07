package com.e104.reciplay.course.courses.dto.request.item;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TodoItem {
    private Integer sequence;
    private String title;
    private String type;
    private Integer seconds;
}
