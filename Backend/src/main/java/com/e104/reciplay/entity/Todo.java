    package com.e104.reciplay.entity;

    import com.e104.reciplay.common.types.TodoType;
    import com.e104.reciplay.course.lecture.dto.response.TodoInfo;
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

        public Todo(TodoInfo todoInfo, Long chapterId) {
            this.sequence = todoInfo.getSequence();
            this.title = todoInfo.getTitle();
            this.type = todoInfo.getType();
            this.seconds = todoInfo.getSeconds();
            this.chapterId = chapterId;
        }
    }
