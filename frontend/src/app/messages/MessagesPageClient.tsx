"use client";

import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatWindow } from "../components/messages/ChatWindow";
import { MessagesSidebar } from "../components/messages/MessagesSidebar";
import { MOCK_CLUBS } from "../components/messages/mockClubs";
import type { ClubThread } from "../components/messages/types";
import { useChatUnread } from "../../context/ChatUnreadContext";

function clubFromParam(
  clubId: string | null,
  legacyClub: string | null,
): ClubThread | null {
  const raw = clubId ?? legacyClub;
  if (!raw) return null;
  return MOCK_CLUBS.find((c) => c.id === raw) ?? null;
}

export default function MessagesPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { unreadByClub, markClubRead } = useChatUnread();

  const clubIdParam = searchParams.get("clubId");
  const legacyClubParam = searchParams.get("club");

  const fromUrl = useMemo(
    () => clubFromParam(clubIdParam, legacyClubParam),
    [clubIdParam, legacyClubParam],
  );

  const [selectedClub, setSelectedClub] = useState<ClubThread | null>(fromUrl);

  useLayoutEffect(() => {
    setSelectedClub(fromUrl);
    if (fromUrl) markClubRead(fromUrl.id);
  }, [fromUrl, markClubRead]);

  const handleSelectClub = useCallback(
    (club: ClubThread) => {
      markClubRead(club.id);
      setSelectedClub(club);
      router.replace(`/messages?clubId=${encodeURIComponent(club.id)}`, {
        scroll: false,
      });
    },
    [markClubRead, router],
  );

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] w-full max-w-[1400px] gap-4 bg-gradient-to-br from-slate-50/90 via-white to-indigo-50/[0.35] p-4 md:gap-5 md:p-6">
      <MessagesSidebar
        clubs={MOCK_CLUBS}
        selectedClub={selectedClub}
        unreadByClub={unreadByClub}
        onSelectClub={handleSelectClub}
      />
      <ChatWindow selectedClub={selectedClub} />
    </div>
  );
}
