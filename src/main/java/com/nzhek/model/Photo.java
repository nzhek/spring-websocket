package com.nzhek.model;

public class Photo {
    private String user_id;
    private String file;

    public Photo() {
    }

    public Photo(String user_id) {
        this.user_id = user_id;
    }

    public Photo(String user_id, String file) {
        this.user_id = user_id;
        this.file = file;
    }

    public String getUser_id() {
        return user_id;
    }

    public String getFile() {
        return file;
    }
}
