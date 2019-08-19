package com.nzhek.sevice;

import com.nzhek.domain.entity.Photo;
import com.nzhek.domain.entity.User;
import com.nzhek.domain.repository.PhotoRepository;
import com.nzhek.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PhotoService {

    @Autowired
    PhotoRepository photoRepository;

    @Autowired
    UserRepository userRepository;

    @Transactional
    public List<Photo> getAll(Long user_id) {
        User u = userRepository.findById(user_id).orElse(null);
        if (u != null) {
            return photoRepository.findByUserId(user_id);
        }

        return null;
    }

    @Transactional
    public Photo save(byte[] file, Long user_id) {
        User u = userRepository.findById(user_id).orElse(null);
        if (u != null) {
            Photo photo = new Photo(file, u);
            photoRepository.save(photo);
            return photo;
        }

        return null;
    }

    public Boolean delete(Long id) {
        photoRepository.deleteById(id);
        return !photoRepository.existsById(id);
    }

}
