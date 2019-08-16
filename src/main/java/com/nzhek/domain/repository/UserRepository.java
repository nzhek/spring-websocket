package com.nzhek.domain.repository;

import com.nzhek.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    public List<User> findByName(String name);

    public List<User> findAll();
}
