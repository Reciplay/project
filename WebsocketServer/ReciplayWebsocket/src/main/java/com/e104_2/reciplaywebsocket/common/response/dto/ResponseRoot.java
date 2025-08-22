package com.e104_2.reciplaywebsocket.common.response.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseRoot <T> {
    private String status;
    private String message;
    private T data;
}
