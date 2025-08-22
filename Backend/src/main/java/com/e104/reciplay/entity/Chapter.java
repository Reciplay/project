package com.e104.reciplay.entity;

import com.e104.reciplay.course.courses.dto.request.item.ChapterItem;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "chapters")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Chapter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lecture_id")
    private Long lectureId;

    private Integer sequence;
    private String title;

    public Chapter(ChapterItem chapterItem, Long lectureId) {
        this.sequence = chapterItem.getSequence();
        this.title = chapterItem.getTitle();
        this.lectureId = lectureId;
    }

    public void update(ChapterItem item) {
        if(!this.title.equals(item.getTitle())) this.title = item.getTitle();
        if(!this.sequence.equals(item.getSequence())) this.sequence = item.getSequence();
    }
}
