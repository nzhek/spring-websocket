package com.nzhek.message;

public class UserUpdateMessage {

    private Long user_id;
    private String name;

    public String getName() {
        return name;
    }

    public Long getUser_id() {
        return user_id;
    }
}
