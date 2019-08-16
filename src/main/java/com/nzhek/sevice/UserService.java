package com.nzhek.sevice;

import com.nzhek.domain.entity.User;
import com.nzhek.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User getOne(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User save(String name) {
        return userRepository.save(new User(name));
    }

    public Boolean delete(Long id) {
        userRepository.deleteById(id);
        return !userRepository.existsById(id);
    }

}
