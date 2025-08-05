package com.e104_2.reciplaywebsocket.room.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChapterIssueRequest {
    private String type;
    private String roomId;
    private String issuer;
    private Integer chapterSequence;
    private Long lectureId;
}
