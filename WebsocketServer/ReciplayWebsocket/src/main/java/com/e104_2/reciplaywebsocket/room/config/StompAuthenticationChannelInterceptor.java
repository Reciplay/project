package com.e104_2.reciplaywebsocket.room.config;

import com.auth0.jwt.exceptions.TokenExpiredException;
import com.e104_2.reciplaywebsocket.room.exception.InvalidTokenException;
import com.e104_2.reciplaywebsocket.room.exception.InvalidTokenFormatException;
import com.e104_2.reciplaywebsocket.security.dto.CustomUserDetails;
import com.e104_2.reciplaywebsocket.security.jwt.JWTUtil;
import com.e104_2.reciplaywebsocket.security.service.TokenQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.security.Principal;

@Component
@RequiredArgsConstructor
public class StompAuthenticationChannelInterceptor implements ChannelInterceptor {
    private final JWTUtil jwtUtil;
    private final TokenQueryService tokenQueryService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        if(StompCommand.CONNECT.equals(accessor.getCommand())) {
            String auth =  accessor.getFirstNativeHeader("Authorization");
            if(!auth.startsWith("Bearer")) throw new InvalidTokenFormatException("유효하지 않은 토큰 길이/Prefix");
            String token = auth.split(" ")[1];
            if(tokenQueryService.isInvalidToken(token) || jwtUtil.isExpired(token)) throw new InvalidTokenException("만료된 토큰 입니다.");

            CustomUserDetails userDetails = new CustomUserDetails();
            userDetails.setUsername(jwtUtil.getUsername(token));
            userDetails.setRole(jwtUtil.getRole(token));

            Principal principal = new UsernamePasswordAuthenticationToken(userDetails, null,
                    userDetails.getAuthorities());
            accessor.setUser(principal);
        }
        return message;
    }
}
