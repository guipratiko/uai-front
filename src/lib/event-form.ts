import type { Event, TicketTier } from "@/types";

export type EventFormData = Omit<Event, "id" | "slug"> & {
  slug?: string;
  cardMode: "upload" | "url";
  bannerMode: "upload" | "url";
  imageUrl: string;
  bannerImageUrl: string;
  imageFile: File | null;
  bannerFile: File | null;
};

export function buildEventFormData(form: EventFormData): FormData {
  const fd = new FormData();
  const { slug, cardMode, bannerMode, imageUrl, bannerImageUrl, imageFile, bannerFile, ...rest } =
    form;

  if (slug) fd.append("slug", slug);

  fd.append("title", rest.title);
  fd.append("subtitle", rest.subtitle);
  fd.append("category", rest.category);
  fd.append("date", rest.date);
  if (rest.endDate) fd.append("endDate", rest.endDate);
  fd.append("time", rest.time);
  fd.append("venue", rest.venue);
  fd.append("address", rest.address);
  fd.append("city", rest.city);
  fd.append("state", rest.state);
  fd.append("description", rest.description);
  fd.append("highlights", JSON.stringify(rest.highlights.filter((h) => h.trim())));
  fd.append("organizer", rest.organizer);
  fd.append("ageRating", rest.ageRating);
  fd.append("mapEmbedUrl", rest.mapEmbedUrl);
  fd.append("coordinates", JSON.stringify(rest.coordinates));
  fd.append("featured", String(rest.featured));
  fd.append(
    "buyerFeePercent",
    rest.buyerFeePercent == null ? "" : String(rest.buyerFeePercent),
  );
  fd.append(
    "platformFeePercent",
    rest.platformFeePercent == null ? "" : String(rest.platformFeePercent),
  );
  fd.append("allowTransfer", String(rest.allowTransfer !== false));
  fd.append("tickets", JSON.stringify(rest.tickets));

  if (cardMode === "upload" && imageFile) {
    fd.append("imageCard", imageFile);
  } else if (cardMode === "url" && imageUrl.trim()) {
    fd.append("imageUrl", imageUrl.trim());
  }

  if (bannerMode === "upload" && bannerFile) {
    fd.append("imageBanner", bannerFile);
  } else if (bannerMode === "url" && bannerImageUrl.trim()) {
    fd.append("bannerImageUrl", bannerImageUrl.trim());
  }

  return fd;
}

function isExternalImageUrl(url: string) {
  return url.startsWith("http") && !url.includes("/uploads/events/");
}

export function eventToFormData(event: Event): EventFormData {
  const cardIsUrl = isExternalImageUrl(event.image);
  const bannerIsUrl = isExternalImageUrl(event.bannerImage);

  return {
    ...event,
    highlights: event.highlights.length ? [...event.highlights] : [""],
    tickets: event.tickets.map((t) => ({ ...t })),
    cardMode: cardIsUrl ? "url" : "upload",
    bannerMode: bannerIsUrl ? "url" : "upload",
    imageUrl: cardIsUrl ? event.image : "",
    bannerImageUrl: bannerIsUrl ? event.bannerImage : "",
    imageFile: null,
    bannerFile: null,
  };
}

export function createEmptyTicket(): TicketTier {
  return {
    id: `tkt-${Math.random().toString(36).slice(2, 8)}`,
    name: "Ingresso",
    description: "",
    price: 0,
    available: 100,
    maxPerOrder: 4,
  };
}

export function emptyEventForm(): EventFormData {
  return {
    title: "",
    subtitle: "",
    category: "Música",
    date: "",
    time: "20:00",
    venue: "",
    address: "",
    city: "Goiânia",
    state: "GO",
    image: "",
    bannerImage: "",
    description: "",
    highlights: [""],
    organizer: "Uai Produções",
    ageRating: "Livre",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.0!2d-49.2647!3d-16.6869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDQxJzEzLjAiUyA0OcKwMTUnMzIuOSJX!5e0!3m2!1spt-BR!2sbr!4v1",
    coordinates: { lat: -16.6869, lng: -49.2647 },
    featured: false,
    buyerFeePercent: null,
    platformFeePercent: null,
    allowTransfer: true,
    tickets: [createEmptyTicket()],
    cardMode: "upload",
    bannerMode: "upload",
    imageUrl: "",
    bannerImageUrl: "",
    imageFile: null,
    bannerFile: null,
  };
}
