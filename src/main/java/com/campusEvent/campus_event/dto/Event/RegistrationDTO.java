package com.campusEvent.campus_event.dto.Event;

import com.campusEvent.campus_event.entity.enums.RegisStatus;
import lombok.Data;
import lombok.Setter;

@Data
public class RegistrationDTO {
    private long ticketId;
    private String EvTitle;
    private RegisStatus regisStatus;
}
