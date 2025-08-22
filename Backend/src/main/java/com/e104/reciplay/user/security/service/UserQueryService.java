package com.e104.reciplay.user.security.service;

import com.e104.reciplay.user.security.domain.User;

import java.time.LocalDate;
import java.util.List;

public interface UserQueryService {
    User queryUserByEmail(String email);
    Boolean isDuplicatedEmail(String email);

    User queryUserByNickname(String nickname);
    Boolean isDuplicatedNickname(String nickname);

    List<String> queryEmailsByNameAndBirthDay(String name, LocalDate birthDay);

    User queryUserById(Long id);


}
