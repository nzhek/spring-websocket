package com.nzhek.message;

public class PhotoMessage {

    private Long photo_id;
    private Long user_id;
    private String file;

    public Long getPhoto_id() {
        return photo_id;
    }

    public Long getUser_id() {
        return user_id;
    }

    public String getFile() {
        return file;
    }

    public void setPhoto_id(Long photo_id) {
        this.photo_id = photo_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public void setFile(String file) {
        this.file = file;
    }
}
