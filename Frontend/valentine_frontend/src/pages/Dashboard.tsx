import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { CalendarIcon, MapPinIcon, QrCodeIcon } from "lucide-react";

interface Ticket {
    id: string;
    status: string;
    qrCode: string; // hash or code
    event: {
        id: string;
        title: string;
        date: string;
        location: string;
    };
}

export default function Dashboard() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/v1/tickets/my-tickets`, {
                    credentials: "include"
                });
                if (res.ok) {
                    const data = await res.json();
                    setTickets(data);
                }
            } catch (error) {
                console.error("Failed to fetch tickets", error);
            } finally {
                setIsLoading(false);
            }
        }
        if (user) fetchTickets();
    }, [user]);

    if (isLoading) return <div>Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
                <p className="text-muted-foreground">Manage your tickets and events.</p>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">My Tickets</h2>
                {tickets.length === 0 ? (
                    <div className="p-8 border rounded-lg text-center text-muted-foreground bg-muted/20">
                        You haven't booked any events yet.
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {tickets.map((ticket) => (
                            <Card key={ticket.id} className="relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-1 h-full ${ticket.status === 'CANCELLED' ? 'bg-red-500' : 'bg-green-500'}`} />
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="truncate pr-4">{ticket.event.title}</CardTitle>
                                        <Badge variant={ticket.status === 'CONFIRMED' ? 'default' : 'destructive'}>
                                            {ticket.status}
                                        </Badge>
                                    </div>
                                    <CardDescription className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="w-4 h-4" />
                                            {format(new Date(ticket.event.date), "MMM d, yyyy • p")}
                                        </div>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                        <MapPinIcon className="w-4 h-4" />
                                        {ticket.event.location}
                                    </div>
                                    {ticket.status === 'CONFIRMED' && (
                                        <div className="bg-white p-4 rounded-lg flex justify-center border">
                                            {/* Placeholder for QR Code */}
                                            <QrCodeIcon className="w-24 h-24 text-black opacity-80" />
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="text-xs text-muted-foreground justify-center">
                                    Ticket ID: {ticket.id.slice(-8).toUpperCase()}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
