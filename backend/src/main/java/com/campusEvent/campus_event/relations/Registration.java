package com.campusEvent.campus_event.relations;

import com.campusEvent.campus_event.entity.Event;
import com.campusEvent.campus_event.entity.User;
import com.campusEvent.campus_event.entity.enums.RegisStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "Registration",
    uniqueConstraints= { @UniqueConstraint(columnNames = {"User_ID", "Event_ID"}) },
        indexes = {
                @Index(columnList = "Registration_ID"),
                @Index(columnList = "User_ID, Event_ID")
        }
)
@Getter @Setter
public class Registration {

    @Id @GeneratedValue(strategy = GenerationType.AUTO) @Column(name="Registration_ID")
    long registrationId;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="User_ID")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="Event_ID")
    private Event event;
    @Enumerated(value = EnumType.STRING)
    private RegisStatus regStats;
}
