package com.e104_2.reciplaywebsocket.domain;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "levels")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Level {
    @Id
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "level")
    private Integer level;
}
