package com.campusEvent.campus_event.entity;

import com.campusEvent.campus_event.entity.enums.EventStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.*;

@Data
@Entity
@Table(indexes = @Index(columnList="Event_ID"))
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="Event_ID")
    private long Eventid;

    @Column private String title, description, venue;

    @Column private int capacity;
    @Column private int booked = 0;


    @Column private LocalDateTime date;

    @Column private LocalTime startTime, endTime;

    @Version private Long version;
    @Column
    @Enumerated(EnumType.STRING)
    private EventStatus eventStatus;

}
