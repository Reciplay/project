package com.e104_2.reciplaywebsocket.room.dto;


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
    private String sender;
    private String receiver;
    private String nickname;
    private Long lectureId;
    private String lectureName;
    private List<String> state;
}
