package com.e104.reciplay.course.qna.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.course.qna.dto.request.QnaAnswerRequest;
import com.e104.reciplay.course.qna.dto.response.QnaDetail;
import com.e104.reciplay.course.qna.dto.response.QnaSummary;
import com.e104.reciplay.course.qna.dto.request.QnaRegisterRequest;
import com.e104.reciplay.course.qna.service.QnaManagementService;
import com.e104.reciplay.user.security.dto.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Qna 관리 API", description = "Qna 관리")
@RestController
@RequestMapping("/api/v1/course/qna")
@Slf4j
@RequiredArgsConstructor
public class QnaApiController{
    private final QnaManagementService qnaManagementService;

    @GetMapping("/summaries")
    @ApiResponse(responseCode = "200", description = "Q&A 요약 정보 리스트 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "404", description = "조회할 강좌를 찾을 수 없음")
    @Operation(summary = "Q&A 요약 정보 리스트 조회 API", description = "Q&A 요약 정보 리스트 조회")
    public ResponseEntity<ResponseRoot<List<QnaSummary>>> getQnaSummaries(
            @RequestParam Long courseId
    ) {

        return CommonResponseBuilder.success("Q&A 목록 조회에 성공하였습니다.",
                List.of(new QnaSummary()));
    }

    @GetMapping("")
    @ApiResponse(responseCode = "200", description = "Q&A 상세 정보 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "404", description = "조회할 Q&A를 찾을 수 없음")
    @Operation(summary = "Q&A 상세 정보 조회 API", description = "Q&A 상세 정보 조회")
    public ResponseEntity<ResponseRoot<QnaDetail>> getQnaDetail(
            @RequestParam Long qnaId
    ) {

        return CommonResponseBuilder.success("Q&A 상세 정보 조회에 성공하였습니다.",
                new QnaDetail());
    }

    @PutMapping("/question")
    @ApiResponse(responseCode = "200", description = "Q&A 질문 수정 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "404", description = "수정할 질문를 찾을 수 없음")
    @Operation(summary = "Q&A 질문 수정 API", description = "Q&A 질문 수정")
    public ResponseEntity<ResponseRoot<Object>> updateQuestion(
            @RequestBody QnaDetail qnaDetail
    ){
        return CommonResponseBuilder.success("Q&A 질문 수정에 성공하였습니다.", null);
    }

    @DeleteMapping("")
    @ApiResponse(responseCode = "200", description = "Q&A 질문 삭제 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "해당 Q&A의 회원&강사가 아닌 다른 사용자 접근")
    @ApiResponse(responseCode = "404", description = "삭제할 질문을 찾을 수 없음")
    @Operation(summary = "Q&A 질문 삭제 API", description = "Q&A 질문 삭제")
    public ResponseEntity<ResponseRoot<Object>> deleteQuestion(
            @RequestParam Long qnaId
    ){

        return CommonResponseBuilder.success("Q&A 질문 삭제에 성공하였습니다.",
                null);
    }


    //////////// ✅
    @PostMapping("/question")
    @ApiResponse(responseCode = "201", description = "Q&A 질문 등록 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @Operation(summary = "Q&A 질문 등록 API", description = "Q&A 질문 등록")
    public ResponseEntity<ResponseRoot<Object>> insertQuestion(
            @RequestBody QnaRegisterRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
            ){
        log.debug("QnA 등록 요청이 도착함 {} ", request);
        log.debug("요청자 {}", userDetails.getUsername());

        qnaManagementService.registerNewQna(request, userDetails.getUsername());
        return CommonResponseBuilder.success("Q&A 질문 등록에 성공하였습니다.", null);
    }

    @PutMapping("/answer")
    @ApiResponse(responseCode = "200", description = "Q&A 답변 수정 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "해당 Q&A의 강사가 아닌 다른 사용자 접근")
    @ApiResponse(responseCode = "404", description = "수정할 Q&A를 찾을 수 없음")
    @Operation(summary = "Q&A 답변 수정 API", description = "Q&A 답변 수정")
    public ResponseEntity<ResponseRoot<Object>> updateAnswer(
            @RequestBody QnaDetail qnaDetail
    ){
        return CommonResponseBuilder.success("Q&A 답변 수정에 성공하였습니다.",
                null);
    }


    //////////// ✅  INSTRUCTOR ONLY.
    @PostMapping("/answer")
    @ApiResponse(responseCode = "200", description = "Q&A 답변 등록 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "해당 Q&A의 강사가 아닌 다른 사용자 접근")
    @ApiResponse(responseCode = "404", description = "수정할 Q&A를 찾을 수 없음")
    @Operation(summary = "Q&A 답변 등록 API", description = "Q&A 답변 등록")
    public ResponseEntity<ResponseRoot<Object>> insertAnswer(
            @RequestBody QnaAnswerRequest qnaDetail,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        log.debug("QnA 답변 등록 API 요청 데이터. {}", qnaDetail);
        log.debug("QnA 답변 등록 API 요청 사용자. {}", userDetails);

        this.qnaManagementService.registerAnswer(qnaDetail, userDetails.getUsername());
        return CommonResponseBuilder.success("Q&A 답변 등록에 성공하였습니다.",
                null);
    }



}