const COMMISSIONER_REF_KEY = "uai-tickets-commissioner-ref";

export type CommissionerRef = {
  code: string;
  eventId: string;
};

export function setCommissionerRef(ref: CommissionerRef) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(COMMISSIONER_REF_KEY, JSON.stringify(ref));
}

export function getCommissionerRef(): CommissionerRef | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(COMMISSIONER_REF_KEY);
    return raw ? (JSON.parse(raw) as CommissionerRef) : null;
  } catch {
    return null;
  }
}

export function getCommissionerCodeForEvent(eventId: string): string | undefined {
  const ref = getCommissionerRef();
  if (!ref || ref.eventId !== eventId) return undefined;
  return ref.code;
}

export function clearCommissionerRef() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(COMMISSIONER_REF_KEY);
}
