package com.fivebits.fivebits_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class FivebitsBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(FivebitsBackendApplication.class, args);
	}

}
