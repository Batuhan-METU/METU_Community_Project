"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

const CATEGORIES = [
  "Technology",
  "Science",
  "Business",
  "Art",
  "Entertainment",
  "Engineering",
  "Music & Dance",
  "Environment",
  "Career",
] as const;

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400";

export default function CreateEventForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const clearPreview = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }, [previewUrl]);

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file || !file.type.startsWith("image/")) return;
      clearPreview();
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    },
    [clearPreview]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Ready for POST /api/events etc.
    const payload = {
      title,
      description,
      date,
      time,
      location,
      category,
      imageName: imageFile?.name ?? null,
    };
    console.info("Create event (mock)", payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image upload */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Event image
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`group relative flex h-48 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed bg-gray-50 transition ${
            isDragging
              ? "border-indigo-500 bg-indigo-50/60"
              : "border-gray-300 hover:border-indigo-400"
          }`}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Preview"
              className="absolute inset-0 h-full w-full rounded-[10px] object-cover"
            />
          ) : (
            <>
              <svg
                className="mb-3 h-10 w-10 text-gray-400 transition group-hover:text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.2}
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Upload Event Image
              </span>
              <span className="mt-1 text-xs text-gray-500">
                Drag & drop or click to upload
              </span>
            </>
          )}
        </button>
        {previewUrl && (
          <button
            type="button"
            onClick={() => {
              setImageFile(null);
              clearPreview();
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            Remove image
          </button>
        )}
      </div>

      <div>
        <label htmlFor="event-title" className="mb-2 block text-sm font-medium text-gray-700">
          Event title
        </label>
        <input
          id="event-title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter event title"
          className={inputClass}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="event-description" className="mb-2 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="event-description"
          name="description"
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your event for attendees"
          className={`${inputClass} resize-y min-h-[120px]`}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="event-date" className="mb-2 block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            id="event-date"
            name="date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="event-time" className="mb-2 block text-sm font-medium text-gray-700">
            Time
          </label>
          <input
            id="event-time"
            name="time"
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="event-location" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          Location
        </label>
        <input
          id="event-location"
          name="location"
          type="text"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Venue or address"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="event-category" className="mb-2 block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="event-category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/events/explore-events"
          className="text-center text-sm font-medium text-gray-600 transition hover:text-gray-900 sm:text-left"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Event
        </button>
      </div>
    </form>
  );
}
