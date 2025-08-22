package com.e104.reciplay.user.security.service;

import com.e104.reciplay.user.auth.dto.request.SignupRequest;

public interface SignupService {
    void signup(SignupRequest request);
    void changePassword(String email, String newPassword);
}
