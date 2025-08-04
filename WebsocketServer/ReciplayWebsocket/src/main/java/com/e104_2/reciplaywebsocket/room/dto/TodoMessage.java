package com.e104_2.reciplaywebsocket.room.dto;

import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TodoMessage {
    private String issuer;
    private Integer chapter;
    private Integer todoNumber;
}
