"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Loader2,
  MapPin,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { cn } from "cn";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  categoryStyle,
  formatEventDate,
  type CommunityEvent,
} from "@/lib/events";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const EVENTS_URL = `${process.env.NEXT_PUBLIC_API_URL}/manage-events`;

/** Same choices as the create-event form so types stay consistent. */
const TYPE_OPTIONS = [
  { value: "relief", label: "Relief" },
  { value: "food", label: "Food Distribution" },
  { value: "education", label: "Education" },
  { value: "health", label: "Healthcare" },
  { value: "environment", label: "Environment" },
];

interface ManageEventCardProps {
  event: CommunityEvent;
}

/**
 * Manage-view event card: same face as `EventCard`, but the bottom row is an
 * Edit (opens a pre-filled dialog that PUTs the event) and a Delete (confirm
 * dialog that DELETEs it). Both refresh the server list on success.
 */
export default function ManageEventCard({ event }: ManageEventCardProps) {

  console.log(event);
  const router = useRouter();
  const category = categoryStyle(event.type);
  const formattedDate = formatEventDate(event.date);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Keep the select controlled: the API may store either the raw value
  // ("food") or the label ("Food Distribution").
  const [type, setType] = useState(event.type || "relief");

  const typeOptions = TYPE_OPTIONS.some((option) => option.value === type)
    ? TYPE_OPTIONS
    : [{ value: type, label: type || "Relief" }, ...TYPE_OPTIONS];

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    
    const formData = new FormData(e.currentTarget);
    const payload = {
      ...Object.fromEntries(formData.entries()),
      type,
    };
    
    
    const token = await getTokenFromClient()

    
    setSaving(true);
    setEditError(null);

    try {
      const res = await fetch(`${EVENTS_URL}/${event._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json",
          authorization: `Bearer ${token}`
         },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Update failed (${res.status})`);
      }

      setEditOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update event:", error);
      setEditError(
        error instanceof Error ? error.message : "Could not save changes",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);

    const token = await getTokenFromClient()

    try {
      const res = await fetch(`${EVENTS_URL}/${event._id}`, {
        method: "DELETE",
        headers:{
          authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Delete failed (${res.status})`);
      }

      setDeleteOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete event:", error);
      setDeleteError(
        error instanceof Error ? error.message : "Could not delete event",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg">
      {/* Cover */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {event.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image}
            alt={event.title}
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}

        <span
          className={cn(
            "absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-sm",
            category.badge,
          )}
        >
          <category.icon className="size-3" />
          {event.type}
        </span>

        {formattedDate ? (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-black/65 px-2.5 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm">
            <CalendarDays className="size-3.5" />
            {formattedDate}
          </span>
        ) : null}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base leading-snug font-bold text-foreground transition-colors group-hover:text-teal-700">
          {event.title}
        </h3>

        <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin
            aria-hidden
            className="mt-px size-3.5 shrink-0 text-teal-500"
          />
          {event.location}
        </p>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {event.description}
        </p>

        {event.organizer ? (
          <p className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
            <Users aria-hidden className="size-3.5 text-teal-500" />
            {event.organizer}
          </p>
        ) : null}
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-border p-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          disabled={!event._id || saving}
          onClick={() => {
            setEditError(null);
            setEditOpen(true);
          }}
        >
          <Pencil className="size-3.5" />
          Edit
        </Button>

        <Button
          variant="destructive"
          size="lg"
          className="flex-1"
          disabled={!event._id || deleting}
          onClick={() => {
            setDeleteError(null);
            setDeleteOpen(true);
          }}
        >
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      </div>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit event</DialogTitle>
            <DialogDescription>
              Update the details below. Volunteers see the changes right away.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`title-${event._id}`}>Event title</Label>
              <Input
                id={`title-${event._id}`}
                name="title"
                defaultValue={event.title}
                required
                className="h-10"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Event type</Label>

                <Select value={type} onValueChange={(value) => value && setType(value)}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`date-${event._id}`}>Event date</Label>
                <Input
                  id={`date-${event._id}`}
                  name="date"
                  type="date"
                  defaultValue={event.date}
                  required
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`location-${event._id}`}>Location / venue</Label>
              <Input
                id={`location-${event._id}`}
                name="location"
                defaultValue={event.location}
                required
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`image-${event._id}`}>Image URL</Label>
              <Input
                id={`image-${event._id}`}
                name="image"
                type="url"
                defaultValue={event.image}
                placeholder="https://example.com/event-photo.jpg"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description-${event._id}`}>
                Event description
              </Label>
              <Textarea
                id={`description-${event._id}`}
                name="description"
                defaultValue={event.description}
                required
                className="min-h-24 resize-y"
              />
            </div>

            {editError ? (
              <p className="text-sm font-medium text-destructive">
                {editError}
              </p>
            ) : null}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={saving}
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                className="bg-teal-600 text-white hover:bg-teal-700"
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Pencil className="size-3.5" />
                )}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{event.title}&rdquo; will be removed permanently. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError ? (
            <p className="text-sm font-medium text-destructive">
              {deleteError}
            </p>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
              Delete event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  );
}
