"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { RateEventModal } from "../app/components/RateEventModal";

type RateEventModalContextValue = {
  openRateModal: (eventId: number) => void;
  closeRateModal: () => void;
};

const RateEventModalContext = createContext<RateEventModalContextValue | null>(
  null,
);

export function RateEventModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [eventId, setEventId] = useState<number | null>(null);

  const openRateModal = useCallback((id: number) => {
    setEventId(id);
  }, []);

  const closeRateModal = useCallback(() => {
    setEventId(null);
  }, []);

  const value = useMemo(
    () => ({ openRateModal, closeRateModal }),
    [openRateModal, closeRateModal],
  );

  return (
    <RateEventModalContext.Provider value={value}>
      {children}
      {eventId != null && (
        <RateEventModal eventId={eventId} onClose={closeRateModal} />
      )}
    </RateEventModalContext.Provider>
  );
}

export function useRateEventModal(): RateEventModalContextValue {
  const ctx = useContext(RateEventModalContext);
  if (!ctx) {
    throw new Error(
      "useRateEventModal must be used within RateEventModalProvider",
    );
  }
  return ctx;
}
