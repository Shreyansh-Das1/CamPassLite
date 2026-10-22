package com.campusEvent.campus_event.dto.User;

import com.campusEvent.campus_event.entity.enums.Role;
import lombok.Data;

@Data
public class UserDTO {
    private int id;
    private String name;
    private String email;
    private String number;
    private Role role;
    private String password;
}
