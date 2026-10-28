"use client";

import { useRef, useState } from "react";
import { Share2, X } from "lucide-react";

export default function ShareForm({
  title,
  path,
}: {
  title: string;
  path: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [nativeShare, setNativeShare] = useState(false);
  const [localPreview, setLocalPreview] = useState(false);

  function openShare() {
    // Use the supplied clean path, never the current payment URL.
    const link = new URL(path, window.location.origin);
    setUrl(link.toString());
    setMessage("");
    setNativeShare(typeof navigator.share === "function");
    setLocalPreview(["localhost", "127.0.0.1"].includes(link.hostname));
    dialog.current?.showModal();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Link copied!");
    } catch {
      setMessage("Select the link below and copy it manually.");
    }
  }

  async function shareMore() {
    try {
      await navigator.share({ title, text: title, url });
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) {
        setMessage("Sharing is unavailable. Please copy the link.");
      }
    }
  }

  const link = encodeURIComponent(url);
  const text = encodeURIComponent(title);
  const options = [
    [
      "WhatsApp",
      `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
    ],
    ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${link}`],
    ["X", `https://x.com/intent/tweet?url=${link}&text=${text}`],
    ["Telegram", `https://t.me/share/url?url=${link}&text=${text}`],
    ["LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${link}`],
    [
      "Email",
      `mailto:?subject=${text}&body=${encodeURIComponent(`${title}\n${url}`)}`,
    ],
  ];

  const button =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <>
      <button
        type="button"
        onClick={openShare}
        className={`${button} mb-4 text-primary`}
      >
        <Share2 size={17} aria-hidden="true" />
        Share this form
      </button>

      <dialog
        ref={dialog}
        aria-label={`Share: ${title}`}
        className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-background p-6 text-foreground shadow-2xl backdrop:bg-slate-950/60 sm:p-8"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif text-3xl font-bold">Share this form</h2>
          <button
            type="button"
            aria-label="Close sharing dialog"
            className={button}
            onClick={() => dialog.current?.close()}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <h3 className="mt-5 text-lg font-semibold">{title}</h3>

        {localPreview && (
          <p className="mt-2 text-sm leading-6 text-muted">
            Local preview: this link works on your device. Public sharing will
            work after the website is deployed.
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {options.map(([label, href]) => (
            <a
              key={label}
              href={href}
              target={label === "Email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              className={button}
            >
              {label} ↗
            </a>
          ))}
        </div>

        <label className="mt-6 block text-sm">
          Form link
          <input
            readOnly
            value={url}
            onFocus={(event) => event.currentTarget.select()}
            className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-primary"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={copyLink} className={button}>
            Copy link
          </button>
          {nativeShare && (
            <button type="button" onClick={shareMore} className={button}>
              More options ↗
            </button>
          )}
        </div>

        <p role="status" className="mt-3 text-sm text-primary">
          {message}
        </p>
      </dialog>
    </>
  );
}
