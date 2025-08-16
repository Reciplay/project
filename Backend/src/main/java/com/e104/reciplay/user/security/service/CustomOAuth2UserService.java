package com.e104.reciplay.user.security.service;

import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.dto.CustomUserDetails;
import com.e104.reciplay.user.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = loadOAuth2User(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = null;
        String name = null;

        if (registrationId.equals("naver")) {
            Map<String, Object> response = (Map<String, Object>) attributes.get("response");
            email = (String) response.get("email");
            name = (String) response.get("name");
        }

        String finalEmail = email;
        String finalName = name;
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .email(finalEmail)
                    .name(finalName)
                    .password(UUID.randomUUID().toString()) // Should be handled more securely
                    .role("ROLE_USER")
                    .isActivated(true)
                    .build();
            return userRepository.save(newUser);
        });

        return new CustomUserDetails(user, attributes);
    }

    protected OAuth2User loadOAuth2User(OAuth2UserRequest userRequest) {
        return super.loadUser(userRequest);
    }
}
