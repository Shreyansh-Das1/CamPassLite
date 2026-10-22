package com.campusEvent.campus_event.service;

import com.campusEvent.campus_event.dto.ResObj;
import com.campusEvent.campus_event.dto.Event.RegistrationDTO;
import com.campusEvent.campus_event.entity.*;
import com.campusEvent.campus_event.entity.enums.RegisStatus;
import com.campusEvent.campus_event.relations.Registration;
import com.campusEvent.campus_event.repository.*;
import jakarta.transaction.Transactional;
import lombok.SneakyThrows;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class RegistrationService {

    @Autowired
    private EventRepo eventrepo;
    @Autowired
    private RegisRepo regisRepo;
    @Autowired  private UserRepo userrepo;


    public ResObj cancel(Long eventId){
        User user = (User) getAuthentication().getPrincipal();
        if(!regisRepo.existsByUser_IdAndEvent_Eventid(user.getId(), eventId))
            return new ResObj(false,"Registration does not exist");

        Registration regist = regisRepo.findByUser_IdAndEvent_Eventid(user.getId(), eventId).orElse(null);
        if(regist.getRegStats().equals(RegisStatus.CANCELLED))
            return new ResObj(false,"Registration has been cancelled");

        regist.setRegStats(RegisStatus.CANCELLED);
        regisRepo.save(regist);

        Event e = regist.getEvent();
        e.setBooked( e.getBooked() -1);
        eventrepo.save(e);

        return new ResObj(true,"Registration has been cancelled successfully");
    }


    public List<Registration> fetchRegistered(){
        Optional<User> user = userrepo.findByUsername(getAuthentication().getName());
        return regisRepo.findByUser(user.orElse(null));

    }



    @Transactional
    @SneakyThrows //Used to declare multiple checked errors could be thrown
    public RegistrationDTO reserveSeat(Long eventId) {

        Long userId = ((User)getAuthentication().getPrincipal()).getId();
        String role = getAuthentication().getAuthorities().iterator().next().getAuthority();
        //NEVER INVOKE SECURITYCONTEXT OUTSIDE METHODS
        if(!eventrepo.existsById(eventId))
            throw new IllegalStateException("Event Not Found");

        if(!role.equals("ROLE_STUDENT"))
            throw new IllegalAccessException(role+" not allowed");

        if( regisRepo.existsByUser_IdAndEvent_Eventid(userId, eventId))
            throw new IllegalStateException("User already registered");

        Event e =  eventrepo.findById(eventId).get();

        if(eventrepo.registerSeat(eventId) == 0)
            throw new IllegalStateException("Event Full");
        else
            return mapToDTO(eventId, userId);
    }



    private RegistrationDTO mapToDTO(Long eventId, Long userId) {
        Registration reg = new Registration();
        reg.setUser((User) getAuthentication().getPrincipal());
        Event ev = eventrepo.findById(eventId).get();
        reg.setEvent(ev);
        reg.setRegStats(RegisStatus.ACTIVE);
        regisRepo.save(reg);

        RegistrationDTO dto = new RegistrationDTO();
        dto.setTicketId( reg.getRegistrationId());
        dto.setRegisStatus(reg.getRegStats());
        dto.setEvTitle(ev.getTitle());
        return dto;
    }

    public Authentication getAuthentication(){
    @Nullable Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    return auth;
    }
}
