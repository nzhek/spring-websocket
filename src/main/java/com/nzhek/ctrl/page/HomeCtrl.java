package com.nzhek.ctrl.page;

import com.nzhek.domain.entity.User;
import com.nzhek.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class HomeCtrl {

    @Autowired
    private UserRepository userRepository;

    @RequestMapping(value = {"/", "/users"}, method = RequestMethod.GET)
    public String home() { // список пользователей
        return "index";
    }

    @RequestMapping(value = "/users/new/create", method = RequestMethod.GET)
    public String create() { // создание пользователя
        return "create";
    }

    @RequestMapping(value = "/users/{name}", method = RequestMethod.GET)
    public String detail(@PathVariable String name, Model model) { // деталка пользователя
        model.addAttribute("name", name);
        return "detail";
    }

    @RequestMapping(value = "/users/{name}/edit", method = RequestMethod.GET) // редактирование
    public String edit(@PathVariable String name, Model model) {
        model.addAttribute("name", name);
        return "edit";
    }

    /*@RequestMapping("/bulkcreate")
    public String bulkcreate(){
        userRepository.save(new User("Evegny"));
        userRepository.saveAll(Arrays.asList(new User("Jury"), new User("ALex"), new User("Oleg")));
        return "bulk create goood moning";
    }*/

}
