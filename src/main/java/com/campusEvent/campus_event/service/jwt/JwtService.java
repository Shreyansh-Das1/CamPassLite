package com.campusEvent.campus_event.service.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtService {

    private final JwtProperties jp;
    @Autowired
    public JwtService(JwtProperties jp) {   this.jp = jp;   }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jp.getSecret().getBytes());
    }

    public String generateToken(String username){
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jp.getExpiration()) )
                .signWith(getSigningKey())
                .compact();
    }
    public String extractUsername(String token){
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
    public boolean validateToken(String token, String username){
        return extractUsername(token).equals(username);
    }
}


/*
> JWT has 3  parts, Header, payload and signature.
  Header contains the algo used, while payload is payload and signature ensures it has not been tampered.
 > It is not stored on server.
 > This Service performs 3 tasks, Generation, Extraction, and Validation.
 > @Service is just specialized version of @Component.
    we use Service when we deal with business logic but this is just a utility
 */
