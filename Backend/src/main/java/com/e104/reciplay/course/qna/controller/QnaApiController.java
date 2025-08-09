package com.e104.reciplay.course.qna.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.course.qna.dto.request.QnaAnswerRequest;
import com.e104.reciplay.course.qna.dto.request.QnaUpdateRequest;
import com.e104.reciplay.course.qna.dto.response.QnaDetail;
import com.e104.reciplay.course.qna.dto.response.QnaSummary;
import com.e104.reciplay.course.qna.dto.request.QnaRegisterRequest;
import com.e104.reciplay.course.qna.service.QnaManagementService;
import com.e104.reciplay.course.qna.service.QnaQueryService;
import com.e104.reciplay.user.security.dto.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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
    private final QnaQueryService qnaQueryService;


    @GetMapping("/summaries")
    @ApiResponse(responseCode = "200", description = "Q&A 요약 정보 리스트 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "404", description = "조회할 강좌를 찾을 수 없음")
    @Operation(summary = "Q&A 요약 정보 리스트 조회 API", description = "Q&A 요약 정보 리스트 조회. Sort 관련 파라미터는 필요 없음.")
    public ResponseEntity<ResponseRoot<List<QnaSummary>>> getQnaSummaries(
            @RequestParam Long courseId,
            @PageableDefault(size = 10, page = 0, sort = "questionAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        log.debug("QnA 게시판 조회 API 요청 데이터. {}", courseId);
        return CommonResponseBuilder.success("Q&A 목록 조회에 성공하였습니다.",
                qnaQueryService.queryQnas(courseId, pageable));
    }


    @GetMapping("")
    @ApiResponse(responseCode = "200", description = "Q&A 상세 정보 조회 성공")
    @ApiResponse(responseCode = "400", description = "존재하지 않는 질문입니다.")
    @Operation(summary = "Q&A 상세 정보 조회 API", description = "Q&A 상세 정보 조회")
    public ResponseEntity<ResponseRoot<QnaDetail>> getQnaDetail(
            @RequestParam Long qnaId
    ) {
        log.debug("QnA 상세 조회 API 요청 데이터. {}", qnaId);
        return CommonResponseBuilder.success("Q&A 상세 정보 조회에 성공하였습니다.",
                qnaQueryService.queryQnaDetail(qnaId));
    }

    @PutMapping("/question")
    @ApiResponse(responseCode = "200", description = "Q&A 질문 수정 성공")
    @ApiResponse(responseCode = "400", description = "- 질문을 작성한 사람만 질문 수정이 가능합니다.\n- 이미 종료된 강좌에는 질문 수정이 불가합니다.\n- 이미 답변이 달린 질문은 수정할 수 없습니다.")
    @Operation(summary = "Q&A 질문 수정 API", description = "Q&A 질문 수정")
    public ResponseEntity<ResponseRoot<Object>> updateQuestion(
            @RequestBody QnaUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        log.debug("QnA 질문 수정 API 요청 데이터. {}", request);
        log.debug("QnA 질문 수정 API 요청 사용자. {}", userDetails);
        this.qnaManagementService.updateQuestion(request, userDetails.getUsername());
        return CommonResponseBuilder.success("Q&A 질문 수정에 성공하였습니다.", null);
    }

    @DeleteMapping("")
    @ApiResponse(responseCode = "200", description = "Q&A 질문 삭제 성공")
    @ApiResponse(responseCode = "400", description = "- 이미 종료된 강좌에는 질문 변경이 불가합니다.\n- 이미 답변이 달린 질문은 수정할 수 없습니다.")
    @ApiResponse(responseCode = "403", description = "- 오직 해당 강의의 강사만 할 수 있습니다.")
    @Operation(summary = "Q&A 질문 삭제 API", description = "Q&A 질문 삭제")
    public ResponseEntity<ResponseRoot<Object>> deleteQuestion(
            @RequestParam Long qnaId, @RequestParam Long courseId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        log.debug("QnA 삭제 요청이 도착함  QnA ID = {}, Course Id = {} ", qnaId, courseId);
        log.debug("요청자 {}", userDetails.getUsername());

        qnaManagementService.deleteQna(qnaId, courseId, userDetails.getUsername());
        return CommonResponseBuilder.success("Q&A 질문 삭제에 성공하였습니다.",
                null);
    }


    @PostMapping("/question")
    @ApiResponse(responseCode = "201", description = "Q&A 질문 등록 성공")
    @ApiResponse(responseCode = "400", description = "- 수강 신청한 사람만 질문 등록이 가능합니다.\n- 이미 종료된 강좌에는 질문 등록이 불가합니다.")
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
    @ApiResponse(responseCode = "400", description = "- 이미 종료된 강좌에는 QnA 변경이 불가합니다.")
    @ApiResponse(responseCode = "403", description = "- 오직 해당 강의의 강사만 할 수 있습니다.")
    @Operation(summary = "Q&A 답변 수정 API", description = "Q&A 답변 수정")
    public ResponseEntity<ResponseRoot<Object>> updateAnswer(
            @ModelAttribute QnaAnswerRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        log.debug("QnA 답변 수정 API 요청 데이터. {}", request);
        log.debug("QnA 답변 수정 API 요청 사용자. {}", userDetails);

        qnaManagementService.updateAnswer(request, userDetails.getUsername());
        return CommonResponseBuilder.success("Q&A 답변 수정에 성공하였습니다.",
                null);
    }


    @PostMapping("/answer")
    @ApiResponse(responseCode = "200", description = "Q&A 답변 등록 성공")
    @ApiResponse(responseCode = "400", description = "- 존재하지 않는 질문 입니다.\n- 이미 답이 존재하는 질문입니다.")
    @ApiResponse(responseCode = "403", description = "- 오직 해당 강의의 강사만 답을 달 수 있습니다.")
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