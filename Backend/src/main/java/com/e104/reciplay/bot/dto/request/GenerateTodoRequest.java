package com.e104.reciplay.bot.dto.request;

import com.e104.reciplay.bot.dto.request.item.LectureAndMaterial;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class GenerateTodoRequest {
    List<LectureAndMaterial> lectureInfos;
}
