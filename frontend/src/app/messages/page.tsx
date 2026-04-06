import { Suspense } from "react";
import MessagesPageClient from "./MessagesPageClient";

function MessagesFallback() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-slate-50/90 via-white to-indigo-50/[0.35] px-4 text-sm text-gray-500">
      Loading messages…
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<MessagesFallback />}>
      <MessagesPageClient />
    </Suspense>
  );
}
