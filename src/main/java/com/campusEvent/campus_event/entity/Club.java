package com.campusEvent.campus_event.entity;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(indexes = @Index(columnList =  "Club_ID"))
public class Club {

    @Id @GeneratedValue(strategy = GenerationType.AUTO) @Column(name = "Club_ID")
    long clubId;
    @Column(unique = true)
    String clubName;
    @OneToMany(mappedBy = "club") @Nullable
    private List<Event> events;
}
