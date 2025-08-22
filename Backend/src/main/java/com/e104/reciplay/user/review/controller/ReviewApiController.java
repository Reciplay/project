package com.e104.reciplay.user.review.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.user.review.dto.request.ReviewRequest;
import com.e104.reciplay.user.review.dto.response.ReviewSummary;
import com.e104.reciplay.user.review.service.ReviewManagementService;
import com.e104.reciplay.user.review.service.ReviewQueryService;
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

@Tag(name = "강좌에 대한 수강평를 달아주는 API", description = "수강평 달기, 수강평 좋아요, 수강평 수정, 수강평 삭제 제공함.")
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/user/review")
public class ReviewApiController {
    private final ReviewQueryService reviewQueryService;
    private final ReviewManagementService reviewManagementService;


    @PostMapping("/like")
    @Operation(summary = "좋아요 하기", description = "특정 수강평에 좋아요 함. 중복 체크하여 이미 좋아요 했으면 에러.")
    @ApiResponse(responseCode = "201", description = "좋아요 성공")
    @ApiResponse(responseCode = "400", description = "중복된 좋아요 요청.")
    public ResponseEntity<ResponseRoot<Object>> likeReview(
            @RequestParam("reviewId") Long reviewId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.debug("좋아요 하기 호출 데이터 = {}", reviewId);
        log.debug("좋아요 하기 호출 사용자 = {}", userDetails);
        reviewManagementService.likeReview(reviewId, userDetails.getUsername());
        return CommonResponseBuilder.success("좋아요에 성공했습니다.", null);
    }

    @PostMapping("")
    @Operation(summary = "수강평 작성하기", description = "특정 강좌에 대한 별점을 매기고 수강평를 작성한다.")
    @ApiResponse(responseCode = "201", description = "수강평 성공")
    @ApiResponse(responseCode = "400", description = "중복된 수강평 요청 또는 존재하지 않는 강좌에 대한 수강평")
    public ResponseEntity<ResponseRoot<Object>> createReview(
            @RequestBody ReviewRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.debug("수강평 남기기 호출 데이터 = {}", request);
        log.debug("수강평 남기기 호출 사용자 = {}", userDetails);
        reviewManagementService.createReview(request, userDetails.getUsername());
        return CommonResponseBuilder.create("수강평 작성에 성공했습니다.", null);
    }

    @DeleteMapping("")
    @Operation(summary = "수강평 삭제하기", description = "특정 강좌에 대한 수강평을 제거한다.")
    @ApiResponse(responseCode = "200", description = "수강평 삭제 성공")
    @ApiResponse(responseCode = "400", description = "수강평 제거 오류")
    public ResponseEntity<ResponseRoot<Object>> deleteReview(
            @RequestBody Long reviewId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.debug("수강평 지우기 호출 데이터 = {}", reviewId);
        log.debug("수강평 지우기 호출 사용자 = {}", userDetails);
        reviewManagementService.deleteReview(reviewId, userDetails.getUsername());
        return CommonResponseBuilder.success("수강평 작성에 성공했습니다.", null);
    }


    @GetMapping("")
    @Operation(summary = "수강평 조회하기", description = "특정 강좌에 대한 수강평를 조회한다.")
    @ApiResponse(responseCode = "200", description = "수강평 조회 성공")
    @ApiResponse(responseCode = "400", description = "존재하지 않는 강좌에 대한 수강평 조회")
    public ResponseEntity<ResponseRoot<List<ReviewSummary>>> getReviews(
            @RequestParam(name = "coursdId") Long courseId,
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        List<ReviewSummary> list = reviewQueryService.queryReviewSummaries(courseId, pageable);

        return CommonResponseBuilder.success("리뷰 조회에 성공했습니다.", list);
    }

    @DeleteMapping("/like")
    @Operation(summary = "좋아요 취소하기", description = "특정 수강평에 좋아요 했다면 취소함.")
    @ApiResponse(responseCode = "200", description = "좋아요 취소 성공")
    @ApiResponse(responseCode = "400", description = "중복된 좋아요 취소 요청.")
    public ResponseEntity<ResponseRoot<Object>> unlikeReview(
            @RequestParam("reviewId") Long reviewId,
            @AuthenticationPrincipal CustomUserDetails userDetails
            ) {
        log.debug("좋아요 취소 하기 호출 데이터 = {}", reviewId);
        log.debug("좋아요 취소 하기 호출 사용자 = {}", userDetails);
        reviewManagementService.unlikeReview(reviewId, userDetails.getUsername());
        return CommonResponseBuilder.success("좋아요를 취소했습니다.", null);
    }
}
