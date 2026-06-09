"use client";

import { useEffect } from "react";
import { setCommissionerRef } from "@/lib/commissioner-ref";

type Props = {
  eventId: string;
};

export function CommissionerRefCapture({ eventId }: Props) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (!ref?.trim()) return;
    setCommissionerRef({ code: ref.trim(), eventId });
  }, [eventId]);

  return null;
}
