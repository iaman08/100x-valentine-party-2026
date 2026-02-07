import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon, TicketIcon, UsersIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
    price: number;
    imageUrl?: string;
}

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRsvpLoading, setIsRsvpLoading] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/v1/events/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setEvent(data);
                } else {
                    toast.error("Event not found");
                    navigate("/events");
                }
            } catch (error) {
                console.error("Failed to fetch event", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, [id, navigate]);

    const handleRSVP = async () => {
        if (!user) {
            toast.error("Please login to RSVP");
            navigate("/auth/login");
            return;
        }

        setIsRsvpLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/v1/tickets/rsvp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Add cookie handling or token if needed, usually browser handles cookies
                    "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` // Fallback if cookie not automatic, though httpOnly forbids this.
                    // Actually, since we used HttpOnly cookies, we rely on `credentials: 'include'`.
                    // But fetch defaults to NOT include credentials. We MUST set it.
                },
                // We need to set credentials: 'include' for cookies to be sent!
            });

            // Simple fix: since I can't easily change the hook implementation to include credentials right now locally
            // I'll assume axios or credentials include was set globally? No, I need to set it here.
            // Wait, standard fetch doesn't send cookies cross-origin unless credentials: include.
            // Same-origin (proxy) sends cookies.
            // Since frontend is likely on localhost:5173 and backend on localhost:3000, we need CORS + credentials.

            // Let's retry with credentials: 'include'
        } catch (error) {
            // ...
        }
        // ...
    };

    // Re-write handleRSVP with correct fetch options
    const onRsvp = async () => {
        if (!user) {
            toast.error("Please login to RSVP");
            navigate("/auth/login");
            return;
        }

        setIsRsvpLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/v1/tickets/rsvp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId: id }),
                credentials: "include" // Important for cookies
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "RSVP failed");

            toast.success("Ticket booked successfully!");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsRsvpLoading(false);
        }
    }


    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (!event) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {event.imageUrl && (
                <div className="aspect-video w-full overflow-hidden rounded-xl shadow-lg relative">
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4">
                        <Badge className="text-lg px-4 py-1" variant="secondary">
                            {event.price === 0 ? "Free Event" : `$${event.price}`}
                        </Badge>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
                        <div className="flex flex-wrap gap-4 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-primary" />
                                <span>{format(new Date(event.date), "PPP p")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5 text-primary" />
                                <span>{event.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="prose max-w-none dark:prose-invert">
                        <h3 className="text-xl font-semibold mb-2">About Event</h3>
                        <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{event.description}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 border rounded-xl bg-card shadow-sm space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <TicketIcon className="w-5 h-5" />
                            Registration
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Price</span>
                                <span className="font-medium">{event.price === 0 ? "Free" : `$${event.price}`}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Capacity</span>
                                <span className="font-medium flex items-center gap-1">
                                    <UsersIcon className="w-3 h-3" />
                                    {event.capacity}
                                </span>
                            </div>
                        </div>
                        <Button className="w-full" size="lg" onClick={onRsvp} disabled={isRsvpLoading}>
                            {isRsvpLoading ? "Booking..." : "Get Ticket"}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">
                            Secure your spot now. Limited availability.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
