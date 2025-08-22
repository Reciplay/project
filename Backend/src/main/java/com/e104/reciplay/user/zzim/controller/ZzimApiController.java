package com.e104.reciplay.user.zzim.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.user.security.dto.CustomUserDetails;
import com.e104.reciplay.user.zzim.service.ZzimManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "찜 관리 API", description = "찜하기, 찜 취소")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user/zzim")
@Slf4j
public class ZzimApiController {
    private final ZzimManagementService zzimManagementService;


    @PostMapping("")
    @Operation(summary = "특정 강좌를 찜합니다.", description = "강좌 ID를 받으면, 강좌 찜 데이터가 생성됩니다. 중복 찜은 에러를 반환합니다.")
    @ApiResponse(responseCode = "200", description = "성공적으로 찜한 경우")
    @ApiResponse(responseCode = "400", description = "이미 찜한 강좌를 찜한 경우")
    public ResponseEntity<ResponseRoot<Object>> doZzim(
            @RequestParam("courseId") Long courseId,
            @AuthenticationPrincipal CustomUserDetails userDetails
            ) {
        log.debug("코스 찜하기 요청. 코스 ID = {}", courseId);
        log.debug("코스 찜하기 요청. 요청 사용자 = {}", userDetails);
        zzimManagementService.zzimCourse(courseId, userDetails.getUsername());
        return CommonResponseBuilder.success("찜하기에 성공했습니다.", null);
    }

    @DeleteMapping("")
    @Operation(summary = "찜을 취소합니다.", description = "강좌 ID를 받으면, 해당 강좌에 대한 찜을 해제합니다. 찜하지 않은 경우 에러를 반환합니다.")
    @ApiResponse(responseCode = "200", description = "성공적으로 찜 취소한 경우")
    @ApiResponse(responseCode = "400", description = "찜하지 않은 강좌를 찜 취소한 경우")
    public ResponseEntity<ResponseRoot<Object>> undoZzim(
            @RequestParam("courseId") Long courseId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.debug("코스 찜취소 요청. 코스 ID = {}", courseId);
        log.debug("코스 찜취소 요청. 요청 사용자 = {}", userDetails);
        zzimManagementService.unzzimCourse(courseId, userDetails.getUsername());
        return CommonResponseBuilder.success("찜취소에 성공했습니다.", null);
    }
}
