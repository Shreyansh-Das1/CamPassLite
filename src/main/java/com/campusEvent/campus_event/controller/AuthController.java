package com.campusEvent.campus_event.controller;

import com.campusEvent.campus_event.dto.User.UserLoginDTO;
import com.campusEvent.campus_event.dto.User.UserRegistDTO;
import com.campusEvent.campus_event.service.AuthService;
import com.campusEvent.campus_event.service.jwt.JwtService;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
}
