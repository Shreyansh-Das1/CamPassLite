package com.campusEvent.campus_event;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class CampusEventLiteApplication {

    public static void main(String[] args) {
        // Use a portable time zone. Some PostgreSQL versions (18+) no longer
        // recognise legacy JVM aliases such as "Asia/Calcutta", which otherwise
        // makes every JDBC connection fail at startup.
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        SpringApplication.run(CampusEventLiteApplication.class, args);
    }

}
