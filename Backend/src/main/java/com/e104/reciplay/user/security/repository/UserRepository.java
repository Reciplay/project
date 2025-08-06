package com.e104.reciplay.user.security.repository;

import com.e104.reciplay.user.security.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);

    Optional<User> findByNickname(String nickname);

    List<User> findByNameAndBirthDate(String name, LocalDate birthDay);
}
