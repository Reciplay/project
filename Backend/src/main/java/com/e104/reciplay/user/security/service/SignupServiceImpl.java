package com.e104.reciplay.user.security.service;

import com.e104.reciplay.entity.Category;
import com.e104.reciplay.entity.Level;
import com.e104.reciplay.repository.CategoryRepository;
import com.e104.reciplay.repository.LevelRepository;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.auth.dto.request.SignupRequest;
import com.e104.reciplay.user.security.exception.DuplicateUserEmailException;
import com.e104.reciplay.user.security.exception.EmailNotFoundException;
import com.e104.reciplay.user.security.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

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
                .isActivated(true)
                .role("ROLE_STUDENT").build();

        if(userRepository.existsByEmail(request.getEmail())) {
            log.debug("이미 존재하는 이메일 입니다. (email : "+request.getEmail() + ")");
            throw new DuplicateUserEmailException("이미 존재하는 이메일 입니다. (email : "+request.getEmail() + ")");
        }

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void changePassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email).orElseThrow(()->new EmailNotFoundException("존재하지 않는 이메일 입니다."));
        user.setPassword(bCryptPasswordEncoder.encode(newPassword));
    }
}
