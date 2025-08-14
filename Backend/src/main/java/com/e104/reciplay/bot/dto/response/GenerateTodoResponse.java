package com.e104.reciplay.bot.dto.response;

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
public class GenerateTodoResponse {
    int sequence;
    List<TodoInfo> todos;
}
