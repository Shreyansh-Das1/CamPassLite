package com.campusEvent.campus_event.controller;

import com.campusEvent.campus_event.dto.User.UserDTO;
import com.campusEvent.campus_event.dto.User.UserLoginDTO;
import com.campusEvent.campus_event.dto.User.UserRegistDTO;
import com.campusEvent.campus_event.entity.User;
import com.campusEvent.campus_event.repository.UserRepo;
import com.campusEvent.campus_event.service.AuthService;
import com.campusEvent.campus_event.service.jwt.JwtService;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtservice;
    @Autowired
    AuthService authService;
    @Autowired
    private UserRepo userRepo;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserLoginDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword())
        );
        String token = jwtservice.generateToken(request.getUsername());
        return ResponseEntity.ok(token);
    }

    @PostMapping("/register")
    @SneakyThrows
    public ResponseEntity<String> register(@RequestBody UserRegistDTO request) {
        if(authService.registerUser(request).isStatus())
            return ResponseEntity.ok("User Registered, Proceed to login");
        return ResponseEntity.ok("User Not Registered, Mail in Use");
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> me(Authentication authentication) {
        if (authentication == null || authentication.getName() == null)
            return ResponseEntity.status(401).build();

        User user = userRepo.findByEmail(authentication.getName());
        if (user == null)
            return ResponseEntity.status(401).build();

        UserDTO dto = new UserDTO();
        dto.setId((int) user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setNumber(user.getNumber());
        dto.setRole(user.getRole());
        return ResponseEntity.ok(dto);
    }
}
