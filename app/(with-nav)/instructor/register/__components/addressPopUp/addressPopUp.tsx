"use client";
import React from "react";

export default function JusoPopupButton() {
    const openJusoPopup = () => {
        const pop = window.open(
            `https://business.juso.go.kr/addrlink/addrLinkUrl.do?confmKey=devU01TX0FVVEgyMDI1MDgwODIxNTMzNjExNjA1MDU&returnUrl=${encodeURIComponent(window.location.origin + "/juso-callback")}&resultType=4`,
            "jusoPopup",
            "width=570,height=420,scrollbars=yes,resizable=yes"
        );

        if (!pop) {
            alert("팝업이 차단되었습니다. 팝업 허용을 해주세요.");
        }
    };

}