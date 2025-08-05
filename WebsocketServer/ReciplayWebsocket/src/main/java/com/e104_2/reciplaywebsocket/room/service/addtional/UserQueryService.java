package com.e104_2.reciplaywebsocket.room.service.addtional;

import com.e104_2.reciplaywebsocket.security.domain.User;

public interface UserQueryService {
    User queryUserByEmail(String email);
    User queryUserById(Long id);
}
