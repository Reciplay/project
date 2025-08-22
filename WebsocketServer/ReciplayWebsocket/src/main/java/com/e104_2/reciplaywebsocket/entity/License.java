package com.e104_2.reciplaywebsocket.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "licenses")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class License {
    @Id
    private Long id;

    private String name;
}
