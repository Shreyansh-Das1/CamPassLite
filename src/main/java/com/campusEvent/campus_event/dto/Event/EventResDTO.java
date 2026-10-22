package com.campusEvent.campus_event.dto.Event;

import com.campusEvent.campus_event.entity.enums.EventStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Setter @Getter
public class EventResDTO {
    private long Eventid;
    private String title, description, venue;
    private int capacity;
    private LocalDateTime date;
    private LocalTime startTime, endTime;
    private EventStatus EventStatus;
}
/*id

title

description

capacity

eventDate

startTime

endTime

venue

status

clubName*/
