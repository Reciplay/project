package com.e104.reciplay.security.controller;

import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.security.dto.SignupRequest;
import com.e104.reciplay.security.exception.DuplicateUserEmailException;
import com.e104.reciplay.security.service.SignupService;
import com.e104.reciplay.security.service.SignupServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "회원가입 컨트롤러", description = "회원가입 API 엔드포인트")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
@Slf4j
public class AuthController {
    private final SignupService signupService;

    @PostMapping("/signup")
    @Operation(summary = "회원가입", description = "이메일, 비밀변호, 닉네임을 전송하여 회원가입합니다.")
    @ApiResponse(responseCode = "201", description = "회원가입 성공")
    @ApiResponse(responseCode = "400", description = "중복 아이디 발견")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            signupService.signup(request);
        } catch(DuplicateUserEmailException e) {
            log.debug("에러발생 : {}", e.getMessage());
            return CommonResponseBuilder.fail(e.getMessage());
        }
        return CommonResponseBuilder.create("회원가입이 완료되었습니다.", null);
    }
}
