package com.smartchat.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.smartchat.app.dto.ChatMessageDTO;
import com.smartchat.app.model.Message;
import com.smartchat.app.model.User;
import com.smartchat.app.service.ChatService;
import com.smartchat.app.service.UserService;

@Controller
public class ChatWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserService userService;

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessageDTO chatMessage) {

        User sender = userService.findByUsername(chatMessage.getSender())
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userService.findByUsername(chatMessage.getReceiver())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message(sender, receiver, chatMessage.getContent());
        chatService.saveMessage(message);

        messagingTemplate.convertAndSend(
                "/topic/messages/" + chatMessage.getReceiver(),
                chatMessage
        );
    }
}
