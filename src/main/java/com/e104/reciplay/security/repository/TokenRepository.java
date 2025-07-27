package com.e104.reciplay.security.repository;

import com.e104.reciplay.security.domain.Token;
import com.e104.reciplay.security.repository.custom.CustomTokenRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


public interface TokenRepository extends JpaRepository<Token, Long>, CustomTokenRepository {
    List<Token> findByUsernameAndIsExpired(String username, Boolean isExpired);
    List<Token> findByUsernameAndIsExpiredAndType(String username, Boolean isExpired, String type);
}
