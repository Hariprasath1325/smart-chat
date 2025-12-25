package com.smartchat.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.smartchat.app.repository")
public class SmartChatBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartChatBackendApplication.class, args);
    }
}
