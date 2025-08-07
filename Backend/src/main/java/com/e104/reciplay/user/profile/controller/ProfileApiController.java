package com.e104.reciplay.user.profile.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.user.profile.service.MyProfileManagementService;
import com.e104.reciplay.user.profile.service.MyProfileQueryService;
import com.e104.reciplay.user.profile.dto.request.ProfileInfoRequest;
import com.e104.reciplay.user.profile.dto.response.ProfileInformation;
import com.e104.reciplay.user.security.dto.CustomUserDetails;
import com.e104.reciplay.user.security.exception.EmailNotFoundException;
import com.e104.reciplay.user.security.util.AuthenticationUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "내 프로필 컨트롤러", description = "내 프로필 API 엔드포인트")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user/profile")
@Slf4j
public class ProfileApiController {
    private final MyProfileManagementService myProfileManagementService;
    private final MyProfileQueryService myProfileQueryService;

    @PostMapping("")
    @Operation(summary = "회원 정보 기입", description = "이름, 생년월일, 성별, 직업을 입력하여 자신의 추가 정보를 저장합니다.")
    @ApiResponse(responseCode = "200", description = "정보 기입 성공")
    @ApiResponse(responseCode = "400", description = "정보 기입 실패 : 이메일이 유저 테이블에 없음.")
    public ResponseEntity<ResponseRoot<Object>> setProfileInfos(
            @RequestBody ProfileInfoRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        String email = userDetails.getUsername();
        log.debug("정보 입력 요청자 이메일 : {}", email);
        myProfileManagementService.setupMyProfile(email, request);

        return CommonResponseBuilder.success("정보 기입에 성공했습니다.", null);
    }

    @PutMapping("")
    @Operation(summary = "회원 정보 수정", description = "이름, 생년월일, 성별, 직업을 수정하여 프로필 정보 갱신를 합니다.")
    @ApiResponse(responseCode = "200", description = "정보 수정 성공")
    @ApiResponse(responseCode = "400", description = "정보 수정 실패 : 이메일이 유저 테이블에 없음")
    public ResponseEntity<ResponseRoot<Object>> updateProfileInfo(
            @RequestBody ProfileInfoRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.debug("정보 수정 요청");
        return this.setProfileInfos(request, userDetails);
    }

    @GetMapping("")
    @Operation(summary = "회원 정보 조회", description = "회원 정보인 이름, 직업, 생년월일, 성별, 직업, 닉네임, 이메일, 성별을 조회 합니다.")
    @ApiResponse(responseCode = "200", description = "정보 조회 성공")
    public ResponseEntity<ResponseRoot<ProfileInformation>> getProfileInfo(
            @AuthenticationPrincipal CustomUserDetails userDetails
            ) {
        ProfileInformation answer = myProfileQueryService.queryProfileInformation(userDetails.getUsername());
        return CommonResponseBuilder.success("프로필 정보 조회에 성공했습니다.", answer);
    }

    @PostMapping("/photo")
    @Operation(summary = "프로필 사진 올리기", description = "프로필 사진을 업데이트 합니다. 기존 사진은 삭제됩니다.")
    @ApiResponse(responseCode = "200", description = "변경 성공")
    @ApiResponse(responseCode = "400", description = "변경 실패 : 이메일이 유저 테이블에 없음.")
    public ResponseEntity<ResponseRoot<Object>> setProfileInfos(
            MultipartFile profileImage,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        String email = userDetails.getUsername();
        log.debug("정보 입력 요청자 이메일 : {}", email);
        myProfileManagementService.updateProfileImage(profileImage, email);
        return CommonResponseBuilder.success("사진 등록에 성공했습니다.", null);
    }
}
