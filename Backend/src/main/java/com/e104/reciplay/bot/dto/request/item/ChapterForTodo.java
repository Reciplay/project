package com.e104.reciplay.bot.dto.request.item;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChapterForTodo {
    private String name;
    private String sequence;
}
