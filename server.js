import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http"; // ✅ For socket.io
import { Server } from "socket.io";
import mongodb from "./src/db/db.js";
import "./src/utils/planCron.js";
import "./src/utils/locationCron.js"

// Routes
import profileRoutes from "./src/routes/Profile.js";
import dashboardRoutes from "./src/routes/dashboard.js";
import clientRoutes from "./src/routes/client.js";
import reportRoutes from "./src/routes/reports.js";
import visitRouter from "./src/routes/visit.js";
import userRouter from "./src/routes/user.js";
import planRouter from "./src/routes/plan.js";
import notificationRoutes from "./src/routes/notification.js";
import locationRoutes from "./src/routes/liveLocation.js";
import admintrack from "./src/routes/AdminTrack.js";
import superAdminRoutes from "./src/superadminroutes/superadmin.js"

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ MongoDB connection
mongodb();

// ✅ Create HTTP + WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// 🔹 WebSocket Events
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("joinAdminRoom", (adminEmail) => {
    socket.join(adminEmail);
    console.log(`Socket ${socket.id} joined room ${adminEmail}`);
  });

  socket.on("disconnect", () => console.log("🔴 Client disconnected:", socket.id));
});

// ✅ Make io accessible globally
app.set("io", io);

// ✅ Register all routes
app.use("/user", userRouter);
app.use("/plan", planRouter);
app.use("/dashboard", dashboardRoutes);
app.use("/notification", notificationRoutes);
app.use("/visit", visitRouter);
app.use("/location", locationRoutes);
app.use("/report", reportRoutes);
app.use("/client", clientRoutes);
app.use("/profile", profileRoutes);
app.use("/admintrack", admintrack);
app.use("/superadmin", superAdminRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running with WebSocket on port ${PORT}`)
);

export { io };