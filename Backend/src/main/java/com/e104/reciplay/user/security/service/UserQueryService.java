package com.e104.reciplay.user.security.service;

import com.e104.reciplay.user.security.domain.User;

public interface UserQueryService {
    User queryUserByEmail(String email);
}
