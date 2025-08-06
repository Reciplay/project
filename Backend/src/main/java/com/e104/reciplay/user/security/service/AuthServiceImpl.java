package com.e104.reciplay.user.security.service;

import com.e104.reciplay.user.auth.dto.request.PasswordChangeRequest;
import com.e104.reciplay.user.auth.dto.request.SignupRequest;
import com.e104.reciplay.user.auth.exception.EmailAuthFailureException;
import com.e104.reciplay.user.auth.exception.InvalidOtpHashException;
import com.e104.reciplay.user.auth.mail.service.MailService;
import com.e104.reciplay.user.auth.redis.AuthRedisService;
import com.e104.reciplay.user.security.domain.Token;
import com.e104.reciplay.user.security.exception.JWTTokenExpiredException;
import com.e104.reciplay.user.security.jwt.JWTUtil;
import com.e104.reciplay.user.security.repository.TokenRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{
    private final JWTUtil jwtUtil;
    @Value("${spring.jwt.expiration}")
    private long ACCESS_TOKEN_EXPIRATION;

    private final TokenRepository tokenRepository;
    private final AuthRedisService authRedisService;
    private final MailService mailService;
    private final UserQueryService userQueryService;

    // 기존 액세스 토큰을 무효화한다.
    // 새롭게 만든 토큰을 DB에 넣는다.
    @Override
    @Transactional
    public void refresh(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        for(Cookie cookie : cookies) {
            if(cookie.getName().equals("refresh-token")) {
                // 리프레시 토큰의 유효성을 검증한다.
                String token = cookie.getValue();
                // 여기서 어떤 값이 날아오는지 확인해야 한다.
                // refresh-token 이라는 prefix가 붙어서 오는지 아니면 떨어져 오는지..

                String username = jwtUtil.getUsername(token);

                if(!jwtUtil.isExpired(token) && tokenRepository.isValidToken(token, username, "REFRESH")) {
                    String newToken = jwtUtil.createJwt(jwtUtil.getUsername(token), null, ACCESS_TOKEN_EXPIRATION);
                    response.setHeader("Authorization", "Bearer " + newToken);
                    // 기존에 존재하던 액세스 토큰을 무효화한다.
                    List<Token> preTokens = tokenRepository.findByUsernameAndIsExpiredAndType(username, false, "ACCESS");
                    for(Token preToken : preTokens) preToken.setIsExpired(true);
                    // 새로 발급된 토큰을 저장한다.
                    tokenRepository.save(new Token(null, newToken, false, "ACCESS", null, username));
                    return;
                }
            }
        }
        throw new JWTTokenExpiredException("쿠키에 토큰이 없거나 만료 혹은 거부되었습니다.");
    }

    @Override
    @Transactional
    public void invalidateAllTokens(String username) {
        List<Token> tokens = tokenRepository.findByUsernameAndIsExpired(username, false);
        for (Token token : tokens) {
            token.setIsExpired(true);
        }
    }

    @Override
    @Transactional
    public void invalidateToken(String plain, String username, String type) {
        Token token = tokenRepository.findValidTokenByPlainAndUsername(plain, username, type);
        token.setIsExpired(true);
    }

    @Override
    @Transactional
    public void issueNewToken(String plain, String username, String type) {
        Token token = new Token(null, plain, false, type, null, username);
        tokenRepository.save(token);
    }

    @Override
    public String generateOTP() {
        byte[] randomBytes = new byte[32];
        new SecureRandom().nextBytes(randomBytes);

        try {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
            byte[] hash = messageDigest.digest(randomBytes);

            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            log.warn("OTP 발급 중, 알고리즘 에러 발생했습니다.");
        }
        return null;
    }

    @Override
    public Boolean isValidEmail(String email) {
        if(email == null || email.isEmpty() || email.length() > 30) return false;

        String regex = "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return email.matches(regex);
    }

    @Override
    public String sendOtpEmail(String email) {
        String otp = this.generateOTP();
        String text = mailService.formAuthEmailText("회원가입 절차를 위한 이메일 인증", otp);
        mailService.sendSimpleMailMessage(email, "Reciplay 이메일 인증", text);

        // redis에 저장해야함. 만료시간 3분
        authRedisService.registAuthToken("email", email, otp, 3);
        return otp;
    }

    @Override
    public void verifyEmailOtp(String email, String otp) {
        String plain = authRedisService.getAuthToken("email", email);
        if(plain == null || !plain.equals(otp)){
            throw new EmailAuthFailureException("이메일 인증에 실패했습니다. 토큰이 틀렸거나 만료 되었습니다.");
        }
    }

    @Override
    public String issueSignupToken(String email) {
        // Signup 용 토큰을 발급합니다.
        String token = this.generateOTP();

        // 3분짜리 auth token 발급합니다. redis에 저장합니다.
        authRedisService.registAuthToken("signup", email, token, 3);

        return token;
    }

    @Override
    public String issuePasswordToken(String email) {
        // Signup 용 토큰을 발급합니다.
        String token = this.generateOTP();

        // 3분짜리 auth token 발급합니다. redis에 저장합니다.
        authRedisService.registAuthToken("password", email, token, 3);

        return token;
    }

    @Override
    public void checkPasswordHash(PasswordChangeRequest request) {
        String original = authRedisService.getAuthToken("password", request.getEmail());
        if(!original.equals(request.getHash())) throw new InvalidOtpHashException("패스워드 변경용 해시 값이 유효하지 않습니다.");
    }

    @Override
    public void verifySignupHash(String email, String hash) {
        String original = authRedisService.getAuthToken("signup", email);
        if(!original.equals(hash)) throw new InvalidOtpHashException("패스워드 변경용 해시 값이 유효하지 않습니다.");
    }

    @Override
    public List<String> querySimillarEmails(String name, LocalDate birthDay) {
        List<String> emails = userQueryService.queryEmailsByNameAndBirthDay(name, birthDay);
        return emails.stream().map(this::hideSensitive).toList();
    }

    @Override
    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        this.invalidateAllTokens(jwtUtil.getUsername(request.getHeader("Authorization").split(" ")[1]));
    }

    public String hideSensitive(String email) {
        StringBuilder sb = new StringBuilder();
        int alpha = email.indexOf("@");
        sb.append(email.charAt(0));
        sb.append("*".repeat(alpha - 1));
        sb.append(email.substring(alpha));
        return sb.toString();
    }
}
