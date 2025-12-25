
const BASE_URL = "http://localhost:8080";

export async function registerUser(userData) {
  const response = await fetch(`${BASE_URL}/api/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
}




export async function loginUser(userData) {
  const response = await fetch(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}


export async function getChatHistory(sender, receiver) {
  const response = await fetch(
    `http://localhost:8080/api/chat/history?senderUsername=${sender}&receiverUsername=${receiver}`
  );

  if (!response.ok) {
    throw new Error("Failed to load chat history");
  }

  return response.json();
}
export async function getAllUsers() {
  const response = await fetch("http://localhost:8080/api/users");

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}
