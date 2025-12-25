import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export function connectWebSocket(username, onMessageReceived) {
  if (stompClient && stompClient.connected) return;

  stompClient = new Client({
    webSocketFactory: () =>
      new SockJS("http://localhost:8080/ws"),

    reconnectDelay: 5000,

    onConnect: () => {
      console.log("WebSocket connected for", username);

      stompClient.subscribe(
        `/topic/messages/${username}`,
        (message) => {
          const body = JSON.parse(message.body);
          onMessageReceived(body);
        }
      );
    }
  });

  stompClient.activate();
}

export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
}

export function sendMessage(message) {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(message)
    });
  }
}
