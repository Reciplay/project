package com.e104_2.reciplaywebsocket.entity;

import com.e104_2.reciplaywebsocket.common.types.TodoType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "todos")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "chapter_id")
    private Long chapterId;

    private Integer sequence;
    private String title;

    @Enumerated(EnumType.ORDINAL)
    private TodoType type;

    private Integer seconds;
}
