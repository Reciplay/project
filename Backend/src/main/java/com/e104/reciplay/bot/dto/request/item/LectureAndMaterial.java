package com.e104.reciplay.bot.dto.request.item;

/*
[
{ "material": "http://127.0.0.1:8001/_local/Reciplay-Todo-List-Generate-Sample.pdf",
  "lecture": {
  "title": "알리오 올리오 만들기",
  "summary": "재료 소개와 기본 조리 순서를 다루는 입문 강의"
}
]

*/

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LectureAndMaterial {
    private String material;
    private LectureForTodo lecture;
}
