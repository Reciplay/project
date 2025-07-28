package com.e104.reciplay.user.review.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.user.review.dto.request.ReviewRequest;
import com.e104.reciplay.user.review.dto.response.ReviewSummary;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.hibernate.query.SortDirection;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Pageable;
import java.util.List;

@Tag(name = "강좌에 대한 수강평를 달아주는 API", description = "수강평 달기, 수강평 좋아요, 수강평 수정, 수강평 삭제 제공함.")
@RestController
@RequestMapping("/api/v1/user/review")
public class ReviewApiController {

    @PostMapping("/like")
    @Operation(summary = "좋아요 하기", description = "특정 수강평에 좋아요 함. 중복 체크하여 이미 좋아요 했으면 에러.")
    @ApiResponse(responseCode = "201", description = "좋아요 성공")
    @ApiResponse(responseCode = "403", description = "중복된 좋아요 요청.")
    public ResponseEntity<ResponseRoot<Object>> likeReview(@RequestParam("reviewId") Long reviewId) {

        return CommonResponseBuilder.success("좋아요에 성공했습니다.", null);
    }

    @PostMapping("")
    @Operation(summary = "수강평 작성하기", description = "특정 강좌에 대한 별점을 매기고 수강평를 작성한다.")
    @ApiResponse(responseCode = "200", description = "수강평 성공")
    @ApiResponse(responseCode = "403", description = "중복된 수강평 요청 또는 존재하지 않는 강좌에 대한 수강평")
    public ResponseEntity<ResponseRoot<Object>> createReview(
            @RequestBody ReviewRequest request
            ) {

        return CommonResponseBuilder.success("수강평 작성에 성공했습니다.", null);
    }

    @GetMapping("")
    @Operation(summary = "수강평 조회하기", description = "특정 강좌에 대한 수강평를 조회한다.")
    @ApiResponse(responseCode = "200", description = "수강평 조회 성공")
    @ApiResponse(responseCode = "403", description = "존재하지 않는 강좌에 대한 수강평 조회")
    public ResponseEntity<ResponseRoot<List<ReviewSummary>>> getReviews(
            @RequestParam(name = "coursdId") Long courseId,
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
            ) {
        return CommonResponseBuilder.success("리뷰 조회에 성공했습니다.", List.of(new ReviewSummary()));
    }

    @DeleteMapping("/like")
    @Operation(summary = "좋아요 취소하기", description = "특정 수강평에 좋아요 했다면 취소함.")
    @ApiResponse(responseCode = "200", description = "좋아요 취소 성공")
    @ApiResponse(responseCode = "403", description = "중복된 좋아요 취소 요청.")
    public ResponseEntity<ResponseRoot<Object>> unlikeReview(@RequestParam("reviewId") Long reviewId) {

        return CommonResponseBuilder.success("좋아요를 취소했습니다.", null);
    }
}
