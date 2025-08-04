    package com.e104.reciplay.entity;

    import com.e104.reciplay.common.types.TodoType;
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
