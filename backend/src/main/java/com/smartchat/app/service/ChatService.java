package com.smartchat.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartchat.app.model.Message;
import com.smartchat.app.model.User;
import com.smartchat.app.repository.MessageRepository;

@Service
public class ChatService {

    @Autowired
    private MessageRepository messageRepository;

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    public List<Message> getMessages(User user1, User user2) {
        return messageRepository.findChatBetweenUsers(user1, user2);
    }

}
