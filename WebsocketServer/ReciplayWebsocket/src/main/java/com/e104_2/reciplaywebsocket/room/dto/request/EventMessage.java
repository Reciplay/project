package com.e104_2.reciplaywebsocket.room.dto.request;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventMessage {
    private String type;
    private String issuer;
    private String receiver;
    private String nickname;
    private Long lectureId;
    private String roomId;
    private List<String> state;
    private String role;
}
