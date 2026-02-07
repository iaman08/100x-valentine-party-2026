import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { CalendarIcon, MapPinIcon, PlusIcon, TrashIcon, UsersIcon } from "lucide-react";

interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    capacity: number;
    tickets: any[]; // count
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/v1/events`, {
                    // Note: need admin auth here potentially, but endpoint is public, creation/deletion is protected.
                    // However, to see stats like attendee count properly, maybe need a specific admin endpoint or just fetch public events which usually don't show all stats.
                    // Let's assume public /events gives enough info or use new /v1/events (public)
                });
                if (res.ok) {
                    const data = await res.json();
                    // In real app, fetching tickets count might require admin privileges or separate call.
                    // Schema shows `tickets` relation, if API returns it, good.
                    // Current getEvents returns basic info.
                    setEvents(data);
                }
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/v1/events/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (res.ok) {
                setEvents(events.filter(e => e.id !== id));
                toast.success("Event deleted");
            } else {
                toast.error("Failed to delete event");
            }
        } catch (error) {
            toast.error("Error deleting event");
        }
    }

    if (isLoading) return <div>Loading admin...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage events and attendees.</p>
                </div>
                <Link to="/admin/events/new">
                    <Button>
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Create Event
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Events</CardTitle>
                    <CardDescription>List of all events covering {events.length} upcoming.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Capacity</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">{event.title}</TableCell>
                                    <TableCell>{format(new Date(event.date), "MMM d, yyyy")}</TableCell>
                                    <TableCell>{event.location}</TableCell>
                                    <TableCell>{event.capacity}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link to={`/events/${event.id}`}>
                                            <Button variant="ghost" size="sm">View</Button>
                                        </Link>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>
                                            <TrashIcon className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
