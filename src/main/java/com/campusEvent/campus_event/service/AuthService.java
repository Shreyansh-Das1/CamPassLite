package com.campusEvent.campus_event.service;


import com.campusEvent.campus_event.dto.ResObj;
import com.campusEvent.campus_event.dto.User.UserRegistDTO;
import com.campusEvent.campus_event.entity.User;
import com.campusEvent.campus_event.entity.enums.Role;
import com.campusEvent.campus_event.repository.UserRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    UserRepo ur;

    public ResObj registerUser(UserRegistDTO udto) throws Exception{
        if(ur.existsByEmail(udto.getEmail()))
            return new ResObj(false, "Email Already Exists");
        User user = new User();
        BeanUtils.copyProperties(udto,user);
        user.setPassword(passwordEncoder.encode(udto.getPassword()));
        user.setRole(Role.STUDENT);
        ur.save(user);
        return new ResObj(true,"User Created");
    }
}
