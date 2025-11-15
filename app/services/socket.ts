import { API_BASE_URL } from "@/app/backend-api/api";
import { io } from "socket.io-client";

const socket = io(API_BASE_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

export default socket;
