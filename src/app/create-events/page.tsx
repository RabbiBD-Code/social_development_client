
"use client";

import { useEffect, useState } from "react";
import { HandHeart, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

export default function CreateEventPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Store today's date
  const [today, setToday] = useState("");

  useEffect(() => {
    const currentDate = new Date().toLocaleDateString("en-CA");
    setToday(currentDate);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    console.log("Submitting data:", data);
    const token = await getTokenFromClient()

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-events`, {
        cache: 'no-store',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          createEmail: user?.email,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to publish event");
      }

      console.log("Success:", result);

      if (result.acknowledged) {
        form.reset();
        router.push("/");
      }
    } catch (error) {
      console.error("Error submitting event:", error);
    }
  };

  if (isPending) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-white px-5 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-200 px-3 py-1 text-xs text-teal-700">
            <HandHeart size={14} />
            Organize a Drive
          </div>

          <h1 className="font-serif text-5xl font-semibold tracking-tight text-black">
            Create Event
          </h1>

          <p className="mt-2 max-w-3xl font-serif text-sm leading-6 text-gray-600">
            Publish a community drive so nearby volunteers can discover it and
            join. Verified organizers review every submission before it goes
            live.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200"
        >
          <div className="space-y-5 p-5 sm:p-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Event title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Winter Clothes Distribution"
                className="h-10"
                required
              />
            </div>

            {/* Type + Date */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Event type</Label>

                <Select defaultValue="relief" name="type">
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="relief">Relief</SelectItem>
                    <SelectItem value="food">Food Distribution</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="health">Healthcare</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Event date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  min={today}
                  className="h-10"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location / venue</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g. Dhanmondi, Dhaka"
                className="h-10"
                required
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/event-photo.jpg"
                className="h-10"
              />

              <p className="font-serif text-xs text-gray-500">
                Optional — add a photo of the venue or a past drive.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Event description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="What will volunteers do? What should they bring?"
                className="min-h-24 resize-y"
                required
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end border-t bg-gray-50 px-5 py-3 sm:px-6">
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700"
            >
              <PlusCircle size={16} />
              Publish Event
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
