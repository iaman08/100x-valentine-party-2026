import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming Shadcn Textarea exists or use generic Input
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const eventSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
    location: z.string().min(3, "Location is required"),
    capacity: z.coerce.number().int().positive("Capacity must be a positive integer"),
    price: z.coerce.number().nonnegative("Price must be non-negative"),
    imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function CreateEvent() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema),
    });

    const onSubmit = async (data: EventFormValues) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/v1/events`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include"
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to create event");
            }

            toast.success("Event created successfully");
            navigate("/admin");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Event</CardTitle>
                    <CardDescription>Fill in the details for the new event.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Event Title</Label>
                            <Input id="title" placeholder="Valentine's Gala" {...register("title")} />
                            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" className="h-24" placeholder="Description..." {...register("description")} />
                            {/* Using Input for simplicity if textarea component missing, normally usage <Textarea /> */}
                            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date & Time</Label>
                                <Input id="date" type="datetime-local" {...register("date")} />
                                {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" placeholder="City Hall" {...register("location")} />
                                {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="capacity">Capacity</Label>
                                <Input id="capacity" type="number" placeholder="100" {...register("capacity")} />
                                {errors.capacity && <p className="text-sm text-red-500">{errors.capacity.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input id="price" type="number" placeholder="0" {...register("price")} />
                                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                            <Input id="imageUrl" placeholder="https://..." {...register("imageUrl")} />
                            {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl.message}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Event"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
