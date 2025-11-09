package com.e104.reciplay.user.security.service;

import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.dto.CustomUserDetails;
import com.e104.reciplay.user.security.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.junit.jupiter.api.Disabled;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.time.Instant;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomOAuth2UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Spy
    @InjectMocks
    private CustomOAuth2UserService customOAuth2UserService;

    private OAuth2UserRequest oAuth2UserRequest;
    private OAuth2User oAuth2User;

    @BeforeEach
    void setUp() {
        ClientRegistration clientRegistration = ClientRegistration.withRegistrationId("naver")
                .clientId("test-client-id")
                .clientSecret("test-client-secret")
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                .scope("name", "email")
                .authorizationUri("https://nid.naver.com/oauth2.0/authorize")
                .tokenUri("https://nid.naver.com/oauth2.0/token")
                .userInfoUri("https://openapi.naver.com/v1/nid/me")
                .userNameAttributeName("response")
                .clientName("Naver")
                .build();

        OAuth2AccessToken accessToken = new OAuth2AccessToken(OAuth2AccessToken.TokenType.BEARER, "test-token", Instant.now(), Instant.now().plusSeconds(60));

        oAuth2UserRequest = new OAuth2UserRequest(clientRegistration, accessToken);

        Map<String, Object> response = new HashMap<>();
        response.put("email", "test@naver.com");
        response.put("name", "testuser");

        Map<String, Object> attributes = new HashMap<>();
        attributes.put("response", response);

        oAuth2User = new DefaultOAuth2User(Collections.emptyList(), attributes, "response");
    }

    @Test
    @DisplayName("네이버 소셜 로그인 - 새로운 유저")
    void loadUser_newUser() {
        // given
                doReturn(oAuth2User).when(customOAuth2UserService).loadOAuth2User(oAuth2UserRequest);
        when(userRepository.findByEmail("test@naver.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L); // Simulate saving to DB and getting an ID
            return user;
        });

        // when
        OAuth2User result = customOAuth2UserService.loadUser(oAuth2UserRequest);

        // then
        assertThat(result).isInstanceOf(CustomUserDetails.class);
        CustomUserDetails userDetails = (CustomUserDetails) result;
        assertThat(userDetails.getUsername()).isEqualTo("test@naver.com");
        assertThat(userDetails.getName()).isEqualTo("testuser");
    }

    @Test
    @DisplayName("네이버 소셜 로그인 - 기존 유저")
    void loadUser_existingUser() {
        // given
        User existingUser = User.builder()
                .id(1L)
                .email("test@naver.com")
                .name("existinguser")
                .build();
                doReturn(oAuth2User).when(customOAuth2UserService).loadOAuth2User(oAuth2UserRequest);
        when(userRepository.findByEmail("test@naver.com")).thenReturn(Optional.of(existingUser));

        // when
        OAuth2User result = customOAuth2UserService.loadUser(oAuth2UserRequest);

        // then
        assertThat(result).isInstanceOf(CustomUserDetails.class);
        CustomUserDetails userDetails = (CustomUserDetails) result;
        assertThat(userDetails.getUsername()).isEqualTo("test@naver.com");
        assertThat(userDetails.getName()).isEqualTo("existinguser");
    }
}