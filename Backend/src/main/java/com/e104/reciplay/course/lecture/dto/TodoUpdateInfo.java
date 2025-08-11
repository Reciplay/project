package com.e104.reciplay.course.lecture.dto;

import com.e104.reciplay.entity.Todo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TodoUpdateInfo extends TodoInfo {
    private Long id;
}
