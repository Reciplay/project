package com.e104.reciplay.user.security.util;

import org.springframework.security.core.context.SecurityContextHolder;

public class AuthenticationUtil {
    public static String getSessionUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    public static String getSessionUserAuthority() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities().iterator().next().getAuthority();
    }
}
