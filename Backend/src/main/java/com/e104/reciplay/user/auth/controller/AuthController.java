package com.e104.reciplay.user.auth.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.user.auth.dto.request.PasswordChangeRequest;
import com.e104.reciplay.user.auth.dto.response.EmailHash;
import com.e104.reciplay.user.auth.dto.request.SignupRequest;
import com.e104.reciplay.user.auth.exception.IllegalEmailFormatException;
import com.e104.reciplay.user.auth.mail.service.MailService;
import com.e104.reciplay.user.auth.redis.AuthRedisService;
import com.e104.reciplay.user.security.exception.DuplicateUserEmailException;
import com.e104.reciplay.user.security.exception.JWTTokenExpiredException;
import com.e104.reciplay.user.security.service.AuthService;
import com.e104.reciplay.user.security.service.SignupService;
import com.e104.reciplay.user.security.service.UserQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Tag(name = "회원가입 컨트롤러", description = "회원가입 API 엔드포인트")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user/auth")
@Slf4j
public class AuthController {
    private final AuthService authService;
    private final UserQueryService userQueryService;
    private final SignupService signupService;

    ////////// ✅
    @PostMapping("/signup")
    @Operation(summary = "회원가입", description = "이메일, 비밀변호, 닉네임을 전송하여 회원가입합니다.")
    @ApiResponse(responseCode = "201", description = "회원가입 성공")
    @ApiResponse(responseCode = "400", description = "중복 아이디 발견")
    public ResponseEntity<?> signup(
            @RequestBody SignupRequest request
    ) {
        if(!authService.isValidEmail(request.getEmail()))
            throw new IllegalEmailFormatException("잘못된 이메일 형식입니다.");
        // 이메일 hash 값과 일치하는지 검증할 것.
        authService.verifySignupHash(request.getEmail(), request.getHash());
        try {
            signupService.signup(request);
        } catch(DuplicateUserEmailException e) {
            log.debug("에러발생 : {}", e.getMessage());
            return CommonResponseBuilder.fail(e.getMessage());
        }
        return CommonResponseBuilder.create("회원가입이 완료되었습니다.", null);
    }

    ////////// ✅
    @GetMapping("/refresh-token")
    @Operation(summary = "액세스 토큰 재발행", description = "액세스 토큰 만료시 리프레시 토큰으로 재발행합니다.")
    @ApiResponse(responseCode = "201", description = "액세스 토큰 재생성 성공")
    public ResponseEntity<?> getTokenRefresing(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        try {
            authService.refresh(request, response);
        } catch (JWTTokenExpiredException e) {
            log.debug("액세스 토큰 재발행 실패 : " + e.getMessage());
            return CommonResponseBuilder.unauthorized(e.getMessage());
        }
        return CommonResponseBuilder.create("토큰 재발행에 성공했습니다.", null);
    }

    ////////// ✅
    @GetMapping("/email")
    @Operation(summary = "이메일 찾기", description = "해당 정보로 가입된 이메일들을 리턴함.")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    public ResponseEntity<ResponseRoot<List<String>>> querySimillarEmails(
            @RequestParam("name") String name,
            @RequestParam("birthday")LocalDate birthDay
            ) {
        return CommonResponseBuilder.success("이메일 조회에 성공했습니다.", authService.querySimillarEmails(name, birthDay));
    }

    ////////// ✅
    @GetMapping("/mail-otp")
    @Operation(summary = "이메일 인증번호 발송", description = "지정된 이메일로 OTP를 발송함.")
    @ApiResponse(responseCode = "200", description = "발송 성공")
    public ResponseEntity<ResponseRoot<Object>> sendEmailOTP(
            @RequestParam("email") String email
    ) {
        if(!authService.isValidEmail(email))
            throw new IllegalEmailFormatException("잘못된 이메일 형식입니다.");
        if(userQueryService.isDuplicatedEmail(email))
            throw new IllegalArgumentException("이미 등록된 이메일 입니다.");

        authService.sendOtpEmail(email);

        return CommonResponseBuilder.success("이메일로 인증번호를 발송했습니다.", null);
    }

    ////////// ✅
    @GetMapping("/mail-verification")
    @Operation(summary = "이메일 인증번호 인증 - 회원 가입용", description = "발송된 인증 번호를 인증함.")
    @ApiResponse(responseCode = "200", description = "인증 성공, 가입을 위한 일회성 토큰을 제공함.")
    @ApiResponse(responseCode = "403", description = "인증 실패")
    public ResponseEntity<ResponseRoot<EmailHash>> verifyEmailOTPSignup(
            @RequestParam("email") String email,
            @RequestParam("otp") String otp
    ) {
        if(!authService.isValidEmail(email))
            throw new IllegalEmailFormatException("잘못된 이메일 형식입니다.");
        if(userQueryService.isDuplicatedEmail(email))
            throw new IllegalArgumentException("이미 등록된 이메일 입니다.");

        authService.verifyEmailOtp(email, otp);
        String signupToken = authService.issueSignupToken(email);
        return CommonResponseBuilder.success("이메일 인증에 성공했습니다.", new EmailHash(signupToken));
    }

    ////////// ✅
    @GetMapping("/mail-verification/password")
    @Operation(summary = "이메일 인증번호 인증 - 비밀번호 변경용.", description = "발송된 인증 번호를 인증함.")
    @ApiResponse(responseCode = "200", description = "인증 성공, 가입을 위한 일회성 토큰을 제공함.")
    @ApiResponse(responseCode = "403", description = "인증 실패")
    public ResponseEntity<ResponseRoot<EmailHash>> verifyEmailOTPPassword(
            @RequestParam("email") String email,
            @RequestParam("otp") String otp
    ) {
        if(!authService.isValidEmail(email))
            throw new IllegalEmailFormatException("잘못된 이메일 형식입니다.");
        if(userQueryService.isDuplicatedEmail(email))
            throw new IllegalArgumentException("이미 등록된 이메일 입니다.");

        authService.verifyEmailOtp(email, otp);
        String signupToken = authService.issuePasswordToken(email);
        return CommonResponseBuilder.success("이메일 인증에 성공했습니다.", new EmailHash(signupToken));
    }

    ////////// ✅
    @PutMapping("/password")
    @Operation(summary = "비밀번호 변경", description = "함께온 일회성 토큰을 검증하고 제거함. 그리고 비밀번호 변경함.")
    @ApiResponse(responseCode = "200", description = "비밀번호 변경 성공.")
    @ApiResponse(responseCode = "403", description = "토큰 에러.")
    public ResponseEntity<ResponseRoot<Object>> updatePassword(
            @RequestBody PasswordChangeRequest request
            ) {
        authService.checkPasswordHash(request);
        signupService.changePassword(request.getEmail(), request.getNewPassword());
        return CommonResponseBuilder.success("비밀번호 변경에 성공 했습니다.", null);
    }

    @GetMapping("/dup-email")
    @Operation(summary = "이메일 중복 확인", description = "사용자가 가입하려는 이메일이 이미 등록된 이메일인지 확인함.")
    @ApiResponse(responseCode = "200", description = "중복 없음. 또는 중복 있음.")
    public ResponseEntity<ResponseRoot<Boolean>> checkDuplicatedEmail(
            @RequestParam("email") String email
    ) {
        if(!authService.isValidEmail(email))
            throw new IllegalEmailFormatException("잘못된 이메일 형식입니다.");
        Boolean result = userQueryService.isDuplicatedEmail(email);
        return CommonResponseBuilder.success("조회에 성공했습니다.", result);
    }

    @GetMapping("/dup-nickname")
    @Operation(summary = "닉네임 중복 확인", description = "사용자가 가입하려는 닉네임이 이미 등록된 이메일인지 확인함.")
    @ApiResponse(responseCode = "200", description = "중복 없음. 또는 중복 있음.")
    public ResponseEntity<ResponseRoot<Boolean>> checkDuplicatedNickname(
            @RequestParam("nickname") String nickname
    ) {
        Boolean result = userQueryService.isDuplicatedNickname(nickname);
        return CommonResponseBuilder.success("조회에 성공했습니다.", result);
    }
}
