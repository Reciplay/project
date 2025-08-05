package com.e104_2.reciplaywebsocket.room.dto.response.item;

import com.e104_2.reciplaywebsocket.common.types.TodoType;
import com.e104_2.reciplaywebsocket.entity.Todo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodoSummary {
    private String title;
    private String type;
    private Integer seconds;
    private Integer sequence;

    public TodoSummary(Todo todo) {
        this.title = todo.getTitle();
        this.type = todo.getType().name();
        this.seconds = todo.getSeconds();
        this.sequence = todo.getSequence();
    }
}
