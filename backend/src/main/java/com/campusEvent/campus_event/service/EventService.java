package com.campusEvent.campus_event.service;

import com.campusEvent.campus_event.dto.Event.*;
import com.campusEvent.campus_event.entity.Event;
import com.campusEvent.campus_event.entity.enums.EventStatus;
import com.campusEvent.campus_event.repository.EventRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class EventService {
    @Autowired
    private EventRepo eventrepo;

    public Iterable<Event> getEvents(){ return eventrepo.findAllByEventStatus(EventStatus.APPROVED);   }
    public EventResDTO createEvent(EventReqDTO erqdto){

        Event newEv = mapFroDTO(erqdto);
        return mapToDTO(newEv);
    }


    public EventResDTO eventApproval(Long id, EventStatus es)
    {

        Event ev = eventrepo.findById(id)
                .orElseThrow(()->new RuntimeException("Event Not Found"));
        ev.setEventStatus(es);
        eventrepo.save(ev);
        return  mapToDTO(ev);
    }



    private EventResDTO mapToDTO(Event event) {
        EventResDTO dto = new EventResDTO();
        dto.setEventid(event.getEventid());
        dto.setTitle(event.getTitle());
        dto.setEventStatus(event.getEventStatus());
        return dto;
    }
    private Event mapFroDTO(EventReqDTO erqdto)
    {
        Event e = new Event();
        e.setDescription(erqdto.getDescription());
        e.setDate(erqdto.getDate());
        e.setStartTime(erqdto.getStartTime());
        e.setEndTime(erqdto.getEndTime());
        e.setVenue(erqdto.getVenue());
        e.setCapacity(erqdto.getCapacity());
        e.setTitle(erqdto.getTitle());
        e.setBooked(0);
        // A newly created event has no status by default (null), which makes it
        // invisible to the approved-events listing. Mark it APPROVED so it is
        // immediately available; admins can still cancel it via the approval endpoint.
        e.setEventStatus(EventStatus.APPROVED);
        eventrepo.save(e);
        return e;
    }
}
/*Methods:

createEvent(EventRequestDTO)

getAllEvents()

getApprovedEvents()

Inside createEvent:

Fetch club by ID

Set status = PENDING

Save event*/
