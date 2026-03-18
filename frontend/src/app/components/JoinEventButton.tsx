"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/api/axios";
import { useAuth } from "@/context/AuthContext";

type JoinEventButtonProps = {
  eventId: string | number;
};

export default function JoinEventButton({ eventId }: JoinEventButtonProps) {
  const [joined, setJoined] = useState(false);
  const [checking, setChecking] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    let alive = true;

    async function checkJoined() {
      if (!token) {
        setJoined(false);
        return;
      }

      try {
        setChecking(true);

        const [profileRes, participantsRes] = await Promise.all([
          axiosClient.get("/me/profile"),
          axiosClient.get(`/events/participants/${eventId}`),
        ]);

        const myUserId = profileRes.data?.id;
        type Participant = { user_id?: string | number | null };
        const participants: Participant[] =
          participantsRes.data?.participants || [];

        const isJoined = participants.some(
          (p) => String(p.user_id) === String(myUserId)
        );

        if (alive) setJoined(isJoined);
      } catch {
        if (alive) setJoined(false);
      } finally {
        if (alive) setChecking(false);
      }
    }

    checkJoined();
    return () => {
      alive = false;
    };
  }, [token, eventId]);

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={async () => {
          setActionLoading(true);
          setFeedback(null);

          try {
            if (joined) {
              await axiosClient.delete(`/events/leave/${eventId}`);
              setJoined(false);
              setFeedback("Etkinlikten ayrıldınız.");
            } else {
              await axiosClient.post(`/events/join/${eventId}`);
              setJoined(true);
              setFeedback("Etkinliğe katıldınız.");
            }
          } catch (e: unknown) {
            const err = e as {
              response?: { status?: number; data?: { error?: string } };
              message?: string;
            };

            const status = err?.response?.status;
            const message =
              err?.response?.data?.error ||
              err?.message ||
              "İşlem başarısız oldu.";

            if (status === 401) {
              alert("Bu işlem için önce giriş yapmalısınız.");
              setJoined(false);
            } else if (joined && status === 404) {
              // UI state'i ile DB state'i senkron değilse (ör. başka cihazdan ayrıldıysa)
              setJoined(false);
              alert(message);
            } else if (!joined && status === 400) {
              // Join duplicate kontrolü (Zaten katıldınız)
              if (message.toLowerCase().includes("zaten")) setJoined(true);
              else alert(message);
            } else {
              alert(message);
            }
          } finally {
            setActionLoading(false);
          }
        }}
        disabled={actionLoading || checking}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
          joined
            ? "border border-red-500/60 bg-transparent text-red-400 hover:bg-red-500/10"
            : "bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:opacity-90"
        } ${actionLoading || checking ? "opacity-80" : ""}`}
      >
        {(actionLoading || checking) && (
          <svg
            className="h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
            />
          </svg>
        )}
        <span>
          {actionLoading || checking
            ? joined
              ? "Ayrılıyor..."
              : "Katılıyor..."
            : joined
              ? "Etkinlikten Ayrıl"
              : "Etkinliğe Katıl"}
        </span>
      </button>

      <div
        role="status"
        aria-live="polite"
        className="mt-3 min-h-[1.5rem]"
      >
        {feedback ? (
          <p
            className={`text-sm ${
              joined ? "text-emerald-400" : "text-emerald-400"
            }`}
          >
            {feedback}
          </p>
        ) : null}
      </div>
    </div>
  );
}
