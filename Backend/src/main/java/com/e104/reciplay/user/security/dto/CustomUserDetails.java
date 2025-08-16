package com.e104.reciplay.user.security.dto;

import com.e104.reciplay.user.security.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Map;

@Data
@NoArgsConstructor
@Builder
public class CustomUserDetails implements UserDetails, OAuth2User {
    private User user;
    private Map<String, Object> attributes;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    public CustomUserDetails(User user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
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

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String getName() {
        return user.getName();
    }
}
