package com.e104.reciplay.bot.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LecturePreparation {
    private Long lectureId;
    private String materialUrl;
}
