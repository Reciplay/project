package com.e104.reciplay.admin.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApprovalInfo {
    private String message;
    private Boolean isApprove;
    private Long courseId; // 강좌 승인/거절 시 요청 데이터
    private Long instructorId;  // 강사 승인/거절 시 요청 데이터
}
