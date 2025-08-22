package com.e104.reciplay.livekit.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CloseLiveRequest {
    private Long lectureId;
    private String roomId;
}
