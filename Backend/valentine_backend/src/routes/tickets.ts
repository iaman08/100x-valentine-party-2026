import { Router } from "express";
import { rsvpEvent, getUserTickets, cancelTicket } from "../controllers/ticketController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/rsvp", authenticateToken, rsvpEvent);
router.get("/my-tickets", authenticateToken, getUserTickets);
router.put("/:id/cancel", authenticateToken, cancelTicket);

export default router;
