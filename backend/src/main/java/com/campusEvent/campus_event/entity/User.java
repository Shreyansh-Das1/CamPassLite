package com.campusEvent.campus_event.entity;

import com.campusEvent.campus_event.entity.enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.antlr.v4.runtime.misc.NotNull;

@Entity
@Getter @Setter
@Table(name  = "users", indexes = @Index(columnList = "User_ID"))
public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    @Column(name="User_ID", unique=true, nullable=false)
    private long id;

    @Column(name="Name", nullable = false)
    private String name;

    @Column(name="Email",unique = true, nullable = false)
    private String email;

    @Column(name="Ph_Number",unique = true, nullable = false)
    private String number;

    @JsonIgnore @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING) @NotNull
    private Role role;
}
