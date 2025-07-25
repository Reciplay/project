package com.e104.reciplay.security.dto;

import com.e104.reciplay.security.domain.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {
    private User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(user.getRole()));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return user.getIsActivated();
    }

    @Override
    public boolean isAccountNonLocked() {
        return user.getIsActivated();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return user.getIsActivated();
    }

    @Override
    public boolean isEnabled() {
        return user.getIsActivated();
    }
}
