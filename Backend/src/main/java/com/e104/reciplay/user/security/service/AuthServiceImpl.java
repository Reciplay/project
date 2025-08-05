package com.e104.reciplay.user.security.service;

import com.e104.reciplay.user.security.domain.Token;
import com.e104.reciplay.user.security.exception.JWTTokenExpiredException;
import com.e104.reciplay.user.security.jwt.JWTUtil;
import com.e104.reciplay.user.security.repository.TokenRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{
    private final JWTUtil jwtUtil;
    @Value("${spring.jwt.expiration}")
    private long ACCESS_TOKEN_EXPIRATION;

    private final TokenRepository tokenRepository;



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
    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        this.invalidateAllTokens(jwtUtil.getUsername(request.getHeader("Authorization").split(" ")[1]));
    }
}
