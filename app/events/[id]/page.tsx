"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Wifi,
  Users,
  CheckCircle,
  Mic,
  ArrowLeft,
  Camera,
  Upload,
  Loader2,
  X,
  CheckCircle2,
  Sparkles,
  Eye,
  AlertCircle,
} from "lucide-react";
import { type Event  } from '@/lib/data';
import { getCollection, saveCollection } from "@/lib/db";
import { uploadImage } from "@/lib/upload";

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface ShowcaseMemory {
  id: string;
  eventId: string;
  src: string;
  status: "pending" | "approved";
  title?: string;
  caption?: string;
  uploadedBy?: string;
  createdAt?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const AGENDA_COLORS: Record<string, string> = {
  info: "border-blue-400 bg-blue-50 text-blue-700",
  talk: "border-purple-400 bg-purple-50 text-purple-700",
  workshop: "border-orange-400 bg-orange-50 text-orange-700",
  qa: "border-green-400 bg-green-50 text-green-700",
};

const AGENDA_LABELS: Record<string, string> = {
  info: "Info",
  talk: "Talk",
  workshop: "Workshop",
  qa: "Q&A",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [event, setEvent] = useState<Event | null | undefined>(undefined);
  const [memories, setMemories] = useState<ShowcaseMemory[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [memoryCaption, setMemoryCaption] = useState("");
  const [uploaderName, setUploaderName] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<ShowcaseMemory | null>(
    null,
  );

  // Load event data
  useEffect(() => {
    getCollection("gdgoc_events")
      .then((stored) => {
        const all = stored && stored.length > 0 ? stored : [];
        const found = all.find((e: any) => e.id === params.id) || null;
        setEvent(found);
      })
      .catch((e) => {
        console.error('Action failed:', e);
        setEvent(null);
      });
  }, [params.id]);

  // Load memories for this event
  const loadApprovedMemories = () => {
    getCollection("gdgoc_showcase")
      .then((parsed) => {
        if (Array.isArray(parsed)) {
          const approved = parsed.filter(
            (item: any) =>
              item.eventId === params.id && item.status === "approved",
          );
          setMemories(approved as ShowcaseMemory[]);
        }
      })
      .catch((e) => {
        console.error("Failed to get gdgoc_showcase", e);
      });
  };

  useEffect(() => {
    loadApprovedMemories();
  }, [params.id]);

  // Handle file select with URL.createObjectURL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WEBP, etc.)");
      return;
    }

    setSelectedFile(file);
    // Use URL.createObjectURL(file) as requested for instant preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Submit memory for approval
  const [isUploading, setIsUploading] = useState(false);

  const handleMemorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("Please select an image file first.");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const imageUrl = await uploadImage(selectedFile, "gdgoc_showcase");

      // Map to the MediaItem schema expected by /admin/media
      const newMemory = {
        id: `upload-${Date.now()}`,
        eventId: params.id,
        url: imageUrl,
        status: "pending",
        caption: memoryCaption.trim() || undefined,
        author: uploaderName.trim() || "Attendee",
        uploadedAt: new Date().toISOString(),
      };

      let existingItems: any[] = [];
      try {
        const saved = await getCollection("gdgoc_media_gallery");
        if (saved) {
          existingItems = saved as any[];
        }
      } catch (err) {
        console.error('Action failed:', err);
      }

      const updated = [newMemory, ...existingItems];
      await saveCollection("gdgoc_media_gallery", updated);

      // Reset modal form
      setSelectedFile(null);
      setPreviewUrl(null);
      setMemoryCaption("");
      setUploaderName("");
      setIsUploadModalOpen(false);

      // Show success notification
      setSuccessMessage("Your memory has been submitted for approval");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      setUploadError(err.message || "An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  if (event === undefined) {
    return (
      <div className="min-h-screen pt-32 bg-slate-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Exploring our events...</p>
      </div>
    );
  }

  if (event === null) {
    return (
      <div className="pt-32 min-h-screen flex flex-col items-center justify-center text-center px-4 bg-slate-50">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">404</h1>
        <p className="text-gray-500 mb-8 text-lg">
          We couldn&apos;t find that event.
        </p>
        <Link
          href="/events"
          className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>
      </div>
    );
  }

  const pct = Math.min((event.registeredCount / event.maxAttendees) * 100, 100);
  const remaining = event.maxAttendees - event.registeredCount;

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Back link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          All Events
        </Link>

        {/* ── Hero Banner ── */}
        <div
          className={`relative overflow-hidden rounded-3xl mb-10 shadow-xl ${
            !event.image
              ? `bg-gradient-to-br ${event.coverGradient} p-8 md:p-12`
              : "bg-gray-900 flex flex-col md:flex-row"
          }`}
        >
          {event.image ? (
            <>
              {/* Left Column: Image */}
              <div className="w-full md:w-2/5 shrink-0 relative min-h-[250px] md:min-h-full">
                <img
                  src={event.image}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Right Column: Text */}
              <div className="p-8 md:p-12 flex-1 relative flex flex-col justify-center bg-gray-900">
                <span className="inline-block bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full mb-4 border border-white/20 w-fit">
                  {event.type}
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
                  {event.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-white/90 text-sm drop-shadow-sm font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {event.startTime} – {event.endTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    {event.isOnline ? (
                      <Wifi className="w-4 h-4" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                    {event.location}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="relative z-10">
              <span className="inline-block bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full mb-4 border border-white/20">
                {event.type}
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-white/90 text-sm drop-shadow-sm font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(event.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {event.startTime} – {event.endTime}
                </span>
                <span className="flex items-center gap-1.5">
                  {event.isOnline ? (
                    <Wifi className="w-4 h-4" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                  {event.location}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Body + Sidebar ── */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: main content */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Description */}
            <section className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow">
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                About this Event
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {event.description}
              </p>
            </section>

            {/* What to Expect */}
            {event.whatToExpect.length > 0 && (
              <section className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  What to Expect
                </h2>
                <ul className="space-y-2">
                  {event.whatToExpect.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Agenda */}
            {event.agenda.length > 0 && (
              <section className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Agenda</h2>
                <div className="space-y-3">
                  {event.agenda.map((item, i) => (
                    <div
                        key={i}
                        className={`flex items-start gap-4 border-l-4 pl-4 py-2 rounded-r-xl ${AGENDA_COLORS[item.type] ?? "border-gray-300 bg-gray-50 text-gray-700"}`}
                      >
                        <div className="flex-shrink-0 w-24">
                          <span className="text-[10px] font-bold uppercase opacity-70 tracking-wider">
                            {AGENDA_LABELS[item.type] ?? item.type}
                          </span>
                          <p className="text-sm font-semibold mt-0.5">
                            {item.time}
                          </p>
                        </div>
                        <div className="flex-1 pb-1">
                          <p className="font-bold text-sm mb-0.5">{item.title}</p>
                          {(item as any).description && (
                            <p className="text-xs opacity-80 leading-relaxed pr-2 whitespace-pre-wrap">{(item as any).description}</p>
                          )}
                        </div>
                      </div>
                  ))}
                </div>
              </section>
            )}

            {/* Speakers */}
            {event.speakers.length > 0 && (
              <section className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Speakers
                </h2>
                <div className="space-y-4">
                  {event.speakers.map((speaker, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                        <Mic className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">
                          {speaker.name}
                        </p>
                        <p className="text-blue-600 text-sm font-medium">
                          {speaker.title}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          {speaker.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: Registration card */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-28 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg space-y-5">
              <h3 className="font-bold text-gray-800 text-lg">Registration</h3>

              {/* Seats progress */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                  <span className="font-medium">
                    {event.registeredCount} registered
                  </span>
                  <span className="text-gray-400">
                    {event.maxAttendees} max
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${event.coverGradient} h-2 rounded-full transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {remaining > 0
                    ? `${remaining} seat${remaining !== 1 ? "s" : ""} remaining`
                    : "Event is full"}
                </p>
              </div>

              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Users className="w-4 h-4 text-gray-400" />
                <span>{event.maxAttendees} total capacity</span>
              </div>

              {/* CTA Buttons */}
              {!event.isPast ? (
                <div className="space-y-3">
                  {event.isOnline && (event as any).meetingLink && (
                    <a
                      href={(event as any).meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-2 w-full text-center bg-gradient-to-r ${event.coverGradient} text-white font-bold py-3 rounded-xl hover:opacity-90 transition shadow`}
                    >
                      <Wifi className="w-4 h-4" />
                      Join Meeting
                    </a>
                  )}
                  {(event as any).bevyLink ? (
                    <button
                      onClick={async () => {
                        try {
                          await fetch(`/api/events/click`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ eventId: event.id }),
                          });
                        } catch (e) {
                          console.error('Action failed:', e);
                        }
                        window.location.href = (event as any).bevyLink;
                      }}
                      className={`block w-full text-center ${event.isOnline && (event as any).meetingLink ? "bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50" : `bg-gradient-to-r ${event.coverGradient} text-white font-bold hover:opacity-90 shadow`} py-3 rounded-xl transition text-sm`}
                    >
                      Register Now
                    </button>
                  ) : (
                    <button
                      disabled
                      className="block w-full text-center bg-gray-300 text-gray-500 font-semibold py-3 rounded-xl cursor-not-allowed text-sm"
                    >
                      Registration Unavailable
                    </button>
                  )}
                  {(event as any).allowSpeakers && (
                    <Link
                      href={`/events/${event.id}/register?role=speaker`}
                      className="block w-full text-center bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition text-sm"
                    >
                      Register as Speaker
                    </Link>
                  )}
                  {(event as any).allowTrainees && (
                    <Link
                      href={`/events/${event.id}/register?role=trainee`}
                      className="block w-full text-center bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition text-sm"
                    >
                      Register as Trainee
                    </Link>
                  )}
                </div>
              ) : (
                <div className="bg-gray-100 rounded-xl py-3 text-center text-gray-500 text-sm font-medium">
                  This event has ended
                </div>
              )}

              {/* Meta */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  {event.startTime} – {event.endTime}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  {event.isOnline ? (
                    <Wifi className="w-3.5 h-3.5" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5" />
                  )}
                  {event.location}
                </div>
                {event.isOnline && (event as any).meetingLink && (
                  <div className="flex items-start gap-2 text-xs">
                    <Wifi className="w-3.5 h-3.5 mt-0.5 text-blue-500 shrink-0" />
                    <a
                      href={(event as any).meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline break-all"
                    >
                      {(event as any).meetingLink}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* ── Event Memories / Gallery Section ── */}
        <section className="mt-16 bg-white/70 backdrop-blur-md border border-white/50 rounded-3xl p-6 sm:p-10 shadow-lg">
          {/* Success Banner */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm shadow-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-semibold">{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200/60">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-2 shadow-xs">
                <Camera className="w-3.5 h-3.5" />
                <span>Event Memories & Gallery</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Moments & Memories
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Photos and highlights shared by organizers and attendees from
                this event.
              </p>
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Upload className="w-4 h-4" />
              Upload a Memory
            </button>
          </div>

          {/* Memories Grid or Empty State */}
          {memories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {memories.map((item) => (
                <motion.div
                  
                  key={item.id}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedMemory(item)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-gray-100 shadow-sm hover:shadow-xl border border-white/60 transition-all duration-300"
                >
                  <img
                    src={item.src}
                    alt={item.title || event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                    <span className="text-xs font-bold truncate leading-tight">
                      {item.title || "Community Memory"}
                    </span>
                    {item.caption && (
                      <span className="text-[11px] text-white/80 line-clamp-1 mt-0.5">
                        {item.caption}
                      </span>
                    )}
                    <span className="text-[10px] text-blue-300 font-medium mt-1 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Click to enlarge
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-2xl bg-white/40 border border-dashed border-gray-300/80">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-1">
                No memories uploaded yet
              </h3>
              <p className="text-gray-500 text-xs max-w-sm mx-auto mb-5">
                Were you at this event? Share your favorite snapshots with the
                GDGOC UNIBEN community!
              </p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload a Memory
              </button>
            </div>
          )}
        </section>

        {/* ── Upload Memory Modal ── */}
        <AnimatePresence>
          {isUploadModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadModalOpen(false)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-md w-full max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5 scrollbar-hide"
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Upload a Memory
                      </h3>
                      <p className="text-xs text-gray-500">
                        Share moments from {event.title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsUploadModalOpen(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {uploadError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <form onSubmit={handleMemorySubmit} className="space-y-4">
                  {/* Image Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Select Photo
                    </label>
                    <label className={`border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-2xl flex cursor-pointer bg-gray-50 hover:bg-blue-50/30 transition group ${selectedFile ? 'p-3 items-center justify-between' : 'p-6 flex-col items-center justify-center text-center'}`}>
                      {selectedFile ? (
                        <>
                          <span className="text-xs font-semibold text-blue-600 truncate max-w-[200px]">
                            {selectedFile.name}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium px-2 py-1 bg-gray-200 rounded-md">Change</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mb-2 transition" />
                          <span className="text-xs font-semibold text-gray-700">Choose an image file</span>
                          <span className="text-[10px] text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Immediate Preview */}
                  {previewUrl && (
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner">
                      <img
                        src={previewUrl}
                        alt="Selected Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Caption */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Caption / Short Note (optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Hackathon team demo presentation!"
                      value={memoryCaption}
                      onChange={(e) => setMemoryCaption(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition resize-none text-gray-800"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Name (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Samuel O."
                      value={uploaderName}
                      onChange={(e) => setUploaderName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition text-gray-800"
                    />
                  </div>

                  <p className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                    Uploaded photos will be reviewed by GDGOC leads before
                    appearing publicly on the event gallery and showcase.
                  </p>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsUploadModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      {isUploading ? 'Uploading...' : 'Submit Memory'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Lightbox Preview Modal ── */}
        <AnimatePresence>
          {selectedMemory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMemory(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
              <motion.div
                
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              >
                <div className="relative aspect-video w-full bg-gray-950">
                  <img
                    src={selectedMemory.src}
                    alt={selectedMemory.title || "Event Memory"}
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => setSelectedMemory(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black text-white text-xs transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {event.title}
                    </span>
                    {selectedMemory.createdAt && (
                      <span className="text-xs text-gray-400">
                        {new Date(
                          selectedMemory.createdAt,
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {selectedMemory.title || "Event Moment"}
                  </h3>
                  {selectedMemory.caption && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {selectedMemory.caption}
                    </p>
                  )}
                  {selectedMemory.uploadedBy && (
                    <p className="text-xs text-gray-400 border-t border-gray-100 pt-3">
                      Uploaded by:{" "}
                      <span className="text-gray-700 font-medium">
                        {selectedMemory.uploadedBy}
                      </span>
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
