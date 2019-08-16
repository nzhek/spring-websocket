package com.nzhek.model;

public class User {
    private String user_id;
    private String name;

    public User(String name) {
        this.name = name;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getUser_id() {
        return user_id;
    }

    public String getName() {
        return name;
    }
}
