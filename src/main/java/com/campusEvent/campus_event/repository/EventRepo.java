package com.campusEvent.campus_event.repository;

import com.campusEvent.campus_event.entity.Event;
import com.campusEvent.campus_event.entity.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepo extends JpaRepository<Event,Long> {
    List<Event> findAll();
    List<Event> findAllByEventStatus(EventStatus status);
    @Modifying
    @Query("""
        UPDATE Event e
        SET e.booked = e.booked + 1
        WHERE e.Eventid = :eventId
        AND e.booked < e.capacity
    """)
    int registerSeat(Long eventId);//Returns number of rows affected
}
