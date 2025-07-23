package com.e104.reciplay.security.service;

import com.e104.reciplay.security.domain.User;
import com.e104.reciplay.security.dto.SignupRequest;
import com.e104.reciplay.security.exception.DuplicateUserEmailException;
import com.e104.reciplay.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SignupServiceImpl implements SignupService{
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    @Override
    public void signup(SignupRequest request) {
        User user = User.builder().email(request.getEmail())
                .password(bCryptPasswordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .role("ROLE_ADMIN").build();

        if(userRepository.existsByEmail(request.getEmail())) {
            log.debug("이미 존재하는 이메일 입니다. (email : "+request.getEmail() + ")");
            throw new DuplicateUserEmailException("이미 존재하는 이메일 입니다. (email : "+request.getEmail() + ")");
        }

        userRepository.save(user);
    }
}
