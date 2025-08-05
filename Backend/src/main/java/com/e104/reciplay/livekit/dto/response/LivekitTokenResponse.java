package com.e104.reciplay.livekit.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LivekitTokenResponse {
    String token;
    String roomId;
    String nickname;
    String email;
    Long lectureId;
}
