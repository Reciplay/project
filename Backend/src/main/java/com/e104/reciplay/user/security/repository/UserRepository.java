package com.e104.reciplay.user.security.repository;

import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.repository.custom.CustomUserRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long>, CustomUserRepository {
    Boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);

    Optional<User> findByNickname(String nickname);

    List<User> findByNameAndBirthDate(String name, LocalDate birthDay);
}
