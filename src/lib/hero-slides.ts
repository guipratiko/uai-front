export type HeroSlide = {
  id: string;
  eventId: string | null;
  eventSlug: string | null;
  eventTitle: string | null;
  title: string;
  subtitle: string;
  imageDesktop: string;
  imageMobile: string;
  imageDesktopUrl: string;
  imageMobileUrl: string;
  displayDurationMs: number;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type HeroSlideFormData = {
  eventId: string;
  title: string;
  subtitle: string;
  displayDurationMs: number;
  sortOrder: number;
  active: boolean;
  desktopMode: "upload" | "url";
  mobileMode: "upload" | "url";
  imageDesktopUrl: string;
  imageMobileUrl: string;
  imageDesktopFile: File | null;
  imageMobileFile: File | null;
};

export function emptyHeroSlideForm(): HeroSlideFormData {
  return {
    eventId: "",
    title: "",
    subtitle: "",
    displayDurationMs: 4000,
    sortOrder: 0,
    active: true,
    desktopMode: "upload",
    mobileMode: "upload",
    imageDesktopUrl: "",
    imageMobileUrl: "",
    imageDesktopFile: null,
    imageMobileFile: null,
  };
}

export function heroSlideToForm(slide: HeroSlide): HeroSlideFormData {
  const desktopIsUrl = slide.imageDesktop.startsWith("http");
  const mobileIsUrl = slide.imageMobile.startsWith("http");
  return {
    eventId: slide.eventId ?? "",
    title: slide.title,
    subtitle: slide.subtitle,
    displayDurationMs: slide.displayDurationMs,
    sortOrder: slide.sortOrder,
    active: slide.active,
    desktopMode: desktopIsUrl ? "url" : "upload",
    mobileMode: mobileIsUrl ? "url" : "upload",
    imageDesktopUrl: desktopIsUrl ? slide.imageDesktop : "",
    imageMobileUrl: mobileIsUrl ? slide.imageMobile : "",
    imageDesktopFile: null,
    imageMobileFile: null,
  };
}

export function buildHeroSlideFormData(form: HeroSlideFormData): FormData {
  const fd = new FormData();
  fd.append("eventId", form.eventId);
  fd.append("title", form.title);
  fd.append("subtitle", form.subtitle);
  fd.append("displayDurationMs", String(form.displayDurationMs));
  fd.append("sortOrder", String(form.sortOrder));
  fd.append("active", String(form.active));

  if (form.desktopMode === "upload" && form.imageDesktopFile) {
    fd.append("imageDesktop", form.imageDesktopFile);
  } else if (form.desktopMode === "url" && form.imageDesktopUrl.trim()) {
    fd.append("imageDesktopUrl", form.imageDesktopUrl.trim());
  }

  if (form.mobileMode === "upload" && form.imageMobileFile) {
    fd.append("imageMobile", form.imageMobileFile);
  } else if (form.mobileMode === "url" && form.imageMobileUrl.trim()) {
    fd.append("imageMobileUrl", form.imageMobileUrl.trim());
  }

  return fd;
}
