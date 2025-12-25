package com.smartchat.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.smartchat.app.model.Message;
import com.smartchat.app.model.User;
import com.smartchat.app.service.ChatService;
import com.smartchat.app.service.UserService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserService userService;

    // Send message
    @PostMapping("/send")
    public Message sendMessage(
            @RequestParam String senderUsername,
            @RequestParam String receiverUsername,
            @RequestParam String content) {

        User sender = userService.findByUsername(senderUsername)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userService.findByUsername(receiverUsername)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message(sender, receiver, content);
        return chatService.saveMessage(message);
    }

    // Get chat history
    @GetMapping("/history")
    public List<Message> getChatHistory(
            @RequestParam String senderUsername,
            @RequestParam String receiverUsername) {

        User sender = userService.findByUsername(senderUsername)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userService.findByUsername(receiverUsername)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        return chatService.getMessages(sender, receiver);
    }
}
