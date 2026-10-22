package com.campusEvent.campus_event.controller;


import com.campusEvent.campus_event.dto.ResObj;
import com.campusEvent.campus_event.dto.Event.RegistrationDTO;
import com.campusEvent.campus_event.relations.Registration;
import com.campusEvent.campus_event.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registration")
public class RegistrationController {

    @Autowired
    RegistrationService registrationService;

    @PutMapping("/reserve")
    @PreAuthorize("hasRole('STUDENT')")
    public @ResponseBody RegistrationDTO reserveEvent(@RequestBody long eventId) {
        return registrationService.reserveSeat(eventId);
    }

    @PutMapping("/{ticketid}/checkin")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResObj checkin(@PathVariable Long ticketid){
        return registrationService.checkin(ticketid);
    }

    @GetMapping("/registered")
    @PreAuthorize("hasRole('STUDENT')")
    public @ResponseBody List<Registration> getRegistered(){
        return registrationService.fetchRegistered();
    }

    @DeleteMapping("/cancel")
    @PreAuthorize("hasRole('STUDENT')")
    public @ResponseBody ResObj cancelRegistration(@RequestBody Long eventId) {
        return registrationService.cancel(eventId);
    }
}
