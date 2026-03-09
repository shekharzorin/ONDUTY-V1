import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "@/app/backend-api/api";

const socket: Socket = io(API_BASE_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,

  // 🔥 VERY IMPORTANT FOR NEXT.JS (avoid SSR auto connect)
  autoConnect: false,
});

export default socket;
