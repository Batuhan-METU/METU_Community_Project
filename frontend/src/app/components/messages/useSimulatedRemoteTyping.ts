"use client";

import { useEffect, useState } from "react";

/**
 * Periodically toggles "someone is typing" for the current club to mimic other users.
 */
export function useSimulatedRemoteTyping(clubId: string | null) {
  const [remoteTyping, setRemoteTyping] = useState(false);

  useEffect(() => {
    if (!clubId) {
      setRemoteTyping(false);
      return;
    }

    let cancelled = false;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      });

    const loop = async () => {
      while (!cancelled) {
        await wait(5500 + Math.random() * 7500);
        if (cancelled) break;
        setRemoteTyping(true);
        await wait(1800 + Math.random() * 1800);
        if (cancelled) break;
        setRemoteTyping(false);
      }
    };

    void loop();

    return () => {
      cancelled = true;
      setRemoteTyping(false);
    };
  }, [clubId]);

  return remoteTyping;
}
