"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function JusoCallbackPage() {
    const params = useSearchParams();

    useEffect(() => {
        if (window.opener && typeof window.opener.jusoCallBack === "function") {
            window.opener.jusoCallBack(
                params.get("roadFullAddr") || "",
                params.get("roadAddrPart1") || "",
                params.get("addrDetail") || ""
            );
        }
        window.close();
    }, [params]);

    return <div>주소 정보를 처리 중입니다...</div>;
}
