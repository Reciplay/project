package com.e104.reciplay.user.security.service;

import com.e104.reciplay.user.auth.dto.request.SignupRequest;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.exception.DuplicateUserEmailException;
import com.e104.reciplay.user.security.exception.EmailNotFoundException;
import com.e104.reciplay.user.security.repository.UserRepository;
import jakarta.transaction.Transactional;
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
        if(!(validatePassword(request.getPassword()))) {
            log.debug("입력된 비밀번호 = {}", request.getPassword());
            throw new IllegalArgumentException("비밀번호 형식 오류");
        }

        if(!(validateNickkname(request.getNickname()))) {
            log.debug("입력된 닉네임 = {}", request.getNickname());
            throw new IllegalArgumentException("닉네임 길이 오류");
        }
        
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

    public boolean validatePassword(String password) {
        if(password == null) return false;
        String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,20}$";
        return password.matches(regex);
    }

    public boolean validateJob(String job) {
        return job.length() > 1 && job.length() < 20;
    }

    public boolean validateNickkname(String nickname) {
        if(nickname == null) return false;
        return nickname.length() > 1 && nickname.length() < 20;
    }
}
