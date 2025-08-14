package com.e104.reciplay.bot.dto.request.item;

/*
"title": "알리오 올리오 만들기",
            "summary": "재료 소개와 기본 조리 순서를 다루는 입문 강의",
            [
                {
                    "name" : "",
                    "sequence" : 1
                }
            ]

*/

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LectureForTodo {
    private String title;
    private String summary;
    List<ChapterForTodo> chapters;
}
