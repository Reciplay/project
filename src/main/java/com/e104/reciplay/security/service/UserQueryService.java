package com.e104.reciplay.security.service;

import com.e104.reciplay.security.domain.User;

public interface UserQueryService {
    User queryUserByEmail(String email);
}
