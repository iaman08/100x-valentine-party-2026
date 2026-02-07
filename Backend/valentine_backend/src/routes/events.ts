import { Router } from "express";
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent, getEventAttendees } from "../controllers/eventController";
import { authenticateToken, authorizeAdmin } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Protected routes (Admin only)
router.post("/", authenticateToken, authorizeAdmin, createEvent);
router.get("/:id/attendees", authenticateToken, authorizeAdmin, getEventAttendees);
router.put("/:id", authenticateToken, authorizeAdmin, updateEvent);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteEvent);

export default router;
