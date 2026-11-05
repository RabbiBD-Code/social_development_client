
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { HandHeart, Loader2 } from "lucide-react"
import type { CommunityEvent } from "@/lib/events"
import { toast } from "sonner"

const JoinEvent = ({ event }: { event: CommunityEvent }) => {
  const router = useRouter()

  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  const [loading, setLoading] = useState(false)

  const handleJoinEvent = async () => {
    if (!user) {
      router.push("/signin")
      return
    }




      const { _id, ...eventData } = event;

const joinData = {
  name: user?.name,
  email: user?.email,
  ...eventData,
  eventId: _id,
};
      console.log(joinData);
      try {
  const res = await fetch("http://localhost:8000/join-event/event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(joinData)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to join event");
  }

toast.success(data.message);
} catch (error) {
  if (error instanceof Error) {
    toast(error.message);
  }
}
  }


  return (
    <div>
      <Button
        onClick={handleJoinEvent}
        type="button"
        size="lg"
        disabled={isPending || loading}
        className="mt-6 h-11 w-full gap-2 bg-teal-600 px-4 text-white hover:bg-teal-700"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <HandHeart className="size-4" />
        )}

        {loading ? "Joining..." : "Join Event"}
      </Button>
    </div>
  )
}

export default JoinEvent
