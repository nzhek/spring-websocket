package com.nzhek.ctrl.websocket;

import com.nzhek.message.PhotoMessage;
import com.nzhek.message.UserMessage;
import com.nzhek.message.UserUpdateMessage;
import com.nzhek.domain.entity.Photo;
import com.nzhek.domain.entity.User;
import com.nzhek.sevice.PhotoService;
import com.nzhek.sevice.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Controller
public class PhotoCtrl {

    @Autowired
    UserService userService;

    @Autowired
    PhotoService photoService;

    @MessageMapping("/photo/create")
    @SendTo("/topic/photo")
    public Photo getPhoto(PhotoMessage photoMessage) throws Exception {
        byte[] photoBytes = photoMessage.getFile().getBytes();
        return photoService.save(photoBytes, photoMessage.getUser_id());
    }

    @MessageMapping("/photo/delete")
    @SendTo("/topic/photo/delete")
    public Boolean photoDelete(PhotoMessage photoMessage) throws Exception {
        return photoService.delete(photoMessage.getPhoto_id());
    }

    @MessageMapping("/photos")
    @SendTo("/topic/photos")
    public List<PhotoMessage> photos(PhotoMessage photoMessage) throws Exception {
        List<Photo> photos = photoService.getAll(photoMessage.getUser_id());
        List<PhotoMessage> photoMessages = new ArrayList<>();
        for (Photo p : photos) {
            PhotoMessage temp = new PhotoMessage();
            temp.setFile(new String(p.getFile()));
            temp.setPhoto_id(p.getId());
            temp.setUser_id(p.getUser().getId());
            photoMessages.add(temp);
        }

        return photoMessages;
    }

    @MessageMapping("/user/create")
    @SendTo("/topic/user/new")
    public User user(UserMessage userMessage) throws Exception {
        String username = HtmlUtils.htmlEscape(userMessage.getName());
        return this.validateUserName(username) ? userService.save(username) : new User();
    }

    @MessageMapping("/user/update")
    @SendTo("/topic/user/status/update")
    public User updateUser(UserUpdateMessage userUpdateMessage) throws Exception {
        String username = HtmlUtils.htmlEscape(userUpdateMessage.getName());
        if (!this.validateUserName(username)) {
            return new User();
        }

        User user = new User(username);
        user.setId(userUpdateMessage.getUser_id());

        return userService.update(user);
    }

    @MessageMapping("/user")
    @SendTo("/topic/user")
    public User getUser(UserUpdateMessage userUpdateMessage) throws Exception {
        return userService.getOne(userUpdateMessage.getUser_id());
    }


    @MessageMapping("/users")
    @SendTo("/topic/users")
    public List<User> users() throws Exception {
        return userService.getAll();
    }

    @MessageMapping("/user/delete")
    @SendTo("/topic/user/delete")
    public User userDelete(UserUpdateMessage userUpdateMessage) throws Exception {
        if (userService.delete(userUpdateMessage.getUser_id())) {
            User u = new User("deleted");
            u.setId(userUpdateMessage.getUser_id());
            return u;
        }
        return null;
    }

    private Boolean validateUserName(String username) {
        Pattern pattern = Pattern.compile("[A-Za-z0-9_]+");
        return pattern.matcher(username).matches();
    }

}