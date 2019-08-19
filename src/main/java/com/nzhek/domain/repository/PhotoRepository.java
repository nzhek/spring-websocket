package com.nzhek.domain.repository;

import com.nzhek.domain.entity.Photo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
    public List<Photo> findByUserId(Long user_id);
}
