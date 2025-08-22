package com.e104.reciplay.bot.dto.response;

import com.e104.reciplay.bot.dto.response.item.GeneratedChapter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GeneratedLecture {
    private Integer sequence;
    private String title;
    private String summary;
    private List<GeneratedChapter> chapters;
}
