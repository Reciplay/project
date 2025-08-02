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
}
