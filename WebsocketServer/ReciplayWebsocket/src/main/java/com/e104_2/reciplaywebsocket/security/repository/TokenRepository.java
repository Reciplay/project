package com.e104_2.reciplaywebsocket.security.repository;

import com.e104_2.reciplaywebsocket.security.domain.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<Token, Long>, CustomTokenRepository {

}
