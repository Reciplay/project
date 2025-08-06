package com.e104.reciplay.user.security.repository;

import com.e104.reciplay.user.security.domain.Token;
import com.e104.reciplay.user.security.repository.custom.CustomTokenRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.awt.print.Pageable;
import java.util.List;


public interface TokenRepository extends JpaRepository<Token, Long>, CustomTokenRepository {
    List<Token> findByUsernameAndIsExpired(String username, Boolean isExpired);
    List<Token> findByUsernameAndIsExpiredAndType(String username, Boolean isExpired, String type);

}
