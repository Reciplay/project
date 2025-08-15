package com.e104.reciplay.bot.dto.response.item;

import com.e104.reciplay.common.types.TodoType;
import com.e104.reciplay.s3.enums.RelatedType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GeneratedTodo {
    private String title;
    private TodoType type;
    private Integer seconds;
    private Integer sequence;
}
