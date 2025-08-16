package com.e104.reciplay.user.security.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.e104.reciplay.user.security.repository.UserRepository;
import com.e104.reciplay.user.security.domain.User;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class SocialOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        OAuth2User loaded = delegate.loadUser(request);

        String registrationId = request.getClientRegistration().getRegistrationId(); // naver, kakao, google
        Map<String, Object> attributes = new HashMap<>(loaded.getAttributes());
        Map<String, Object> flat = new HashMap<>();

        if ("naver".equals(registrationId)) {
            Map<String, Object> resp = asMap(attributes.get("response"));
            flat.putAll(resp);
            flat.putIfAbsent("email", resp.get("email"));
            flat.putIfAbsent("name", resp.get("name"));
            flat.putIfAbsent("picture", resp.get("profile_image"));
            flat.putIfAbsent("id", resp.get("id"));
        } else if ("kakao".equals(registrationId)) {
            Map<String, Object> account = asMap(attributes.get("kakao_account"));
            Map<String, Object> profile = asMap(account.get("profile"));
            flat.put("id", String.valueOf(attributes.get("id")));
            flat.put("email", account.get("email"));
            flat.put("name", profile.getOrDefault("nickname", ""));
            flat.put("picture", profile.getOrDefault("profile_image_url", ""));
        } else if ("google".equals(registrationId)) {
            flat.putAll(attributes);                 // email, name, picture 존재
            flat.put("id", attributes.getOrDefault("sub", attributes.get("id")));
        } else {
            flat.putAll(attributes);
        }

        String email = Objects.toString(flat.get("email"), null);
        if (email == null || email.isBlank()) {
            log.error("소셜 로그인에 이메일이 없습니다. provider={}, attrs={}", registrationId, flat);
            throw new OAuth2AuthenticationException("Email scope/consent is required");
        }

        // upsert
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User u = User.builder()
                    .email(email)
                    .nickname(Objects.toString(flat.getOrDefault("name", email.split("@")[0])))
                    .name(Objects.toString(flat.getOrDefault("name", "")))
                    .isActivated(true)
                    .role("ROLE_STUDENT")
                    .build();
            return userRepository.save(u);
        });

        boolean changed = false;
        if (user.getName() == null && flat.get("name") != null) { user.setName(Objects.toString(flat.get("name"))); changed = true; }
        if (user.getNickname() == null && flat.get("name") != null) { user.setNickname(Objects.toString(flat.get("name"))); changed = true; }
        if (user.getIsActivated() == null) { user.setIsActivated(true); changed = true; }
        if (user.getRole() == null) { user.setRole("ROLE_STUDENT"); changed = true; }
        if (changed) userRepository.save(user);

        Collection<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(user.getRole()));
        // nameAttributeKey를 email로: principal.getName() == email
        return new DefaultOAuth2User(authorities, flat, "email");
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> asMap(Object obj) {
        if (obj instanceof Map) return (Map<String, Object>) obj;
        return new HashMap<>();
    }
}
