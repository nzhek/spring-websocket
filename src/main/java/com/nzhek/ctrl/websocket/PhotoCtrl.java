package com.nzhek.ctrl.websocket;

import com.nzhek.domain.repository.UserRepository;
import com.nzhek.message.PhotoMessage;
import com.nzhek.message.UserMessage;
import com.nzhek.message.UserUpdateMessage;
import com.nzhek.model.Photo;
import com.nzhek.domain.entity.User;
import com.nzhek.sevice.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import java.util.List;

@Controller
public class PhotoCtrl {

    @Autowired
    UserService userService;

    @MessageMapping("/photo/create")
    @SendTo("/topic/photo")
    public Photo photo(PhotoMessage photoMessage) throws Exception {
        return new Photo(HtmlUtils.htmlEscape(photoMessage.getUser_id()), photoMessage.getFile());
    }

    @MessageMapping("/user/create")
    @SendTo("/topic/user/new")
    public User user(UserMessage userMessage) throws Exception {
        return userService.save(HtmlUtils.htmlEscape(userMessage.getName()));
    }

    @MessageMapping("/user/update")
    @SendTo("/topic/user/status/update")
    public User updateUser(UserUpdateMessage userUpdateMessage) throws Exception {
//        User user = new User(HtmlUtils.htmlEscape(userUpdateMessage.getName()));
//        user.setUser_id(userUpdateMessage.getUser_id());
        return null;
    }

    @MessageMapping("/user")
    @SendTo("/topic/user")
    public User getUser(UserUpdateMessage userUpdateMessage) throws Exception {
//        User user = new User(HtmlUtils.htmlEscape(userUpdateMessage.getName()));
//        user.setUser_id(userUpdateMessage.getUser_id());

        return userService.getOne(userUpdateMessage.getUser_id());
    }


    @MessageMapping("/users")
    @SendTo("/topic/users")
    public List<User> users() throws Exception {
        return userService.getAll();
    }

    @MessageMapping("/user/delete")
    @SendTo("/topic/user/delete")
    public User delete(UserUpdateMessage userUpdateMessage) throws Exception {
        if (userService.delete(userUpdateMessage.getUser_id())) {
            User u = new User("deleted");
            u.setId(userUpdateMessage.getUser_id());
            return u;
        }
        return null;
    }

}