import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon } from "lucide-react";

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
    price: number;
    imageUrl?: string;
    tickets: any[];
}

export default function Events() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/v1/events`);
                if (res.ok) {
                    const data = await res.json();
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

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Loading events...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Upcoming Events</h1>
                <p className="text-muted-foreground">Discover and join amazing events happening around you.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                    <Card key={event.id} className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow">
                        {event.imageUrl && (
                            <div className="aspect-video w-full overflow-hidden">
                                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform hover:scale-105" />
                            </div>
                        )}
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                                <Badge variant={event.price === 0 ? "secondary" : "default"}>
                                    {event.price === 0 ? "Free" : `$${event.price}`}
                                </Badge>
                            </div>
                            <CardDescription className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                {format(new Date(event.date), "PPP p")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{event.description}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPinIcon className="w-4 h-4" />
                                <span>{event.location}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link to={`/events/${event.id}`} className="w-full">
                                <Button className="w-full">View Details</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
                {events.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No upcoming events found. Check back later!
                    </div>
                )}
            </div>
        </div>
    );
}
