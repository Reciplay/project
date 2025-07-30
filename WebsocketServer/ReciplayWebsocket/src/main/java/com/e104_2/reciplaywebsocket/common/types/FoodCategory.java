package com.e104_2.reciplaywebsocket.common.types;

public enum FoodCategory {
    KOREAN, CHINESE, JAPANESE, WESTERN, DESSERT, ETC;
    // 엔티티 클래스엔 @Enumerated(EnumType.STRING)으로 명시. 또는 ORDINAL -> DB 순서에 맞출 것.
}
