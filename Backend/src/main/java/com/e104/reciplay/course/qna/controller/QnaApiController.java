package com.e104.reciplay.course.qna.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.course.qna.dto.response.QnaDetail;
import com.e104.reciplay.course.qna.dto.response.QnaSummary;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Qna 관리 API", description = "Qna 관리")
@RestController
@RequestMapping("/api/v1/course/qna")
@Slf4j

public class QnaApiController{

    @GetMapping("/summary")
    @Operation(summary = "Q&A 요약 정보 리스트 조회 API", description = "Q&A 요약 정보 리스트 조회")
    public ResponseEntity<ResponseRoot<List<Object>>> getQnaSummaries(
            @RequestParam Long courseId
    ) {

        return CommonResponseBuilder.success("Q&A 목록 조회에 성공하였습니다.",
                List.of(new QnaSummary()));
    }

    @GetMapping("")
    @Operation(summary = "Q&A 상세 정보 조회 API", description = "Q&A 상세 정보 조회")
    public ResponseEntity<ResponseRoot<Object>> getQnaDetail(
            @RequestParam Long qnaId
    ) {

        return CommonResponseBuilder.success("Q&A 상세 정보 조회에 성공하였습니다.",
                new QnaDetail());
    }

    @PutMapping("/question")
    @Operation(summary = "Q&A 질문 수정 API", description = "Q&A 질문 수정")
    public ResponseEntity<ResponseRoot<Object>> updateQuestion(
            @RequestParam Long qnaId,
            @RequestParam String title,
            @RequestParam String content
    ){
        return CommonResponseBuilder.success("Q&A 질문 수정에 성공하였습니다.", null);
    }

    @DeleteMapping("")
    @Operation(summary = "Q&A 질문 삭제 API", description = "Q&A 질문 삭제")
    public ResponseEntity<ResponseRoot<Object>> deleteQuestion(
            @RequestParam Long qnaId
    ){

        return CommonResponseBuilder.success("Q&A 질문 삭제에 성공하였습니다.",
                null);
    }

    @PostMapping("/question")
    @Operation(summary = "Q&A 질문 등록 API", description = "Q&A 질문 등록")
    public ResponseEntity<ResponseRoot<Object>> insertQuestion(
            @RequestParam Long qnaId,
            @RequestParam String title,
            @RequestParam String content
    ){

        return CommonResponseBuilder.success("Q&A 질문 등록에 성공하였습니다.",
                null);
    }

    @PutMapping("/answer")
    @Operation(summary = "Q&A 답변 수정 API", description = "Q&A 답변 수정")
    public ResponseEntity<ResponseRoot<Object>> updateAnswer(
            @RequestParam Long qnaId,
            @RequestParam String content
    ){
        return CommonResponseBuilder.success("Q&A 답변 수정에 성공하였습니다.",
                null);
    }

    @PostMapping("/answer")
    @Operation(summary = "Q&A 답변 등록 API", description = "Q&A 답변 등록")
    public ResponseEntity<ResponseRoot<Object>> insertAnswer(
            @RequestParam Long qnaId,
            @RequestParam String content
    ){

        return CommonResponseBuilder.success("Q&A 답변 등록에 성공하였습니다.",
                null);
    }



}