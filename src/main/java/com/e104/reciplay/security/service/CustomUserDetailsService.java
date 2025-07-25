package com.e104.reciplay.security.service;

import com.e104.reciplay.security.domain.User;
import com.e104.reciplay.security.dto.CustomUserDetails;
import com.e104.reciplay.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("유저가 존재하지 않습니다."));
        CustomUserDetails userDetails = new CustomUserDetails(user);
        return userDetails;
    }
}
