package com.e104.reciplay.course.courses.dto.request.item;

import com.e104.reciplay.course.lecture.dto.ChapterInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChapterUpdateItem extends ChapterItem {
    private Long id;
}
