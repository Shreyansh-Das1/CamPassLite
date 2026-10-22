package com.campusEvent.campus_event.dto.Event;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;
@Getter @Setter
public class EventReqDTO {
    private String title, description, venue;
    private int capacity;
    private LocalDateTime date;
    private LocalTime startTime, endTime;
}