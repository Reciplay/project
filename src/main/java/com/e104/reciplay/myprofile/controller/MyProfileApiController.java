package com.e104.reciplay.myprofile.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.myprofile.dto.ProfileInfoRequest;
import com.e104.reciplay.myprofile.dto.ProfileInformation;
import com.e104.reciplay.myprofile.service.MyProfileManagementService;
import com.e104.reciplay.myprofile.service.MyProfileQueryService;
import com.e104.reciplay.myprofile.service.MyProfileQueryServiceImpl;
import com.e104.reciplay.security.exception.EmailNotFoundException;
import com.e104.reciplay.security.service.UserQueryService;
import com.e104.reciplay.security.util.AuthenticationUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "내 프로필 컨트롤러", description = "내 프로필 API 엔드포인트")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/my-profile")
@Slf4j
public class MyProfileApiController {
    private final MyProfileManagementService myProfileManagementService;
    private final MyProfileQueryService myProfileQueryService;

    @PostMapping("/info")
    @Operation(summary = "회원 정보 기입", description = "이름, 생년월일, 성별, 직업을 입력하여 자신의 추가 정보를 저장합니다.")
    @ApiResponse(responseCode = "200", description = "정보 기입 성공")
    @ApiResponse(responseCode = "400", description = "정보 기입 실패 : 이메일이 유저 테이블에 없음.")
    public ResponseEntity<?> setProfileInfos(@RequestBody ProfileInfoRequest request) {
        String email = AuthenticationUtil.getSessionUsername();
        log.debug("정보 입력 요청자 이메일 : {}", email);
        try {

            myProfileManagementService.setupMyProfile(email, request);

        } catch (EmailNotFoundException e) {
            return CommonResponseBuilder.fail(e.getMessage());
        }
        return CommonResponseBuilder.success("정보 기입에 성공했습니다.", null);
    }

    @PutMapping("/info")
    @Operation(summary = "회원 정보 수정", description = "이름, 생년월일, 성별, 직업을 수정하여 프로필 정보 갱신를 합니다.")
    @ApiResponse(responseCode = "200", description = "정보 수정 성공")
    @ApiResponse(responseCode = "400", description = "정보 수정 실패 : 이메일이 유저 테이블에 없음")
    public ResponseEntity<?> updateProfileInfo(@RequestBody ProfileInfoRequest request) {
        log.debug("정보 수정 요청");
        return this.setProfileInfos(request);
    }

    @GetMapping("/info")
    @Operation(summary = "회원 정보 조회", description = "회원 정보인 이름, 직업, 생년월일, 성별, 직업, 닉네임, 이메일, 성별을 조회 합니다.")
    @ApiResponse(responseCode = "200", description = "정보 조회 성공")
    public ResponseEntity<ResponseRoot<ProfileInformation>> getProfileInfo() {
        ProfileInformation answer = myProfileQueryService.queryProfileInformation();
        return CommonResponseBuilder.success("프로필 정보 조회에 성공했습니다.", answer);
    }
}
