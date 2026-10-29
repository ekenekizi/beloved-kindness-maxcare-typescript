"use client";

import { useEffect, useRef, useState } from "react";
import Image from "@/components/ui/ResponsiveImage";
import { ArrowRight, Images, Play, Video, X } from "lucide-react";
import type { GalleryVideo } from "../types";

export default function VideoGallery({
  videos, unavailable = false, onBrowsePhotos,
}: {
  videos: GalleryVideo[];
  unavailable?: boolean;
  onBrowsePhotos: () => void;
}) {
  const [selected, setSelected] = useState<GalleryVideo | null>(null);
  const [playerError, setPlayerError] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const player = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!selected) return;
    const modal = dialog.current;
    const video = player.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (modal && !modal.open) modal.showModal();
    return () => {
      video?.pause();
      modal?.close();
      document.body.style.overflow = overflow;
    };
  }, [selected]);

  function openVideo(video: GalleryVideo) {
    setPlayerError(false);
    setSelected(video);
  }

  if (unavailable || !videos.length) {
    return (
      <div className="mt-8 rounded-3xl border border-blue-100 bg-white/70 px-6 py-14 text-center sm:py-20">
        <div aria-hidden="true" className="relative mx-auto mb-8 flex h-28 w-40 items-center justify-center">
          <span className="absolute inset-3 -rotate-12 rounded-2xl border-4 border-blue-100 bg-blue-50" />
          <span className="relative flex h-20 w-28 rotate-6 items-center justify-center rounded-2xl border-4 border-blue-200 bg-white">
            <Video size={38} className="text-primary" />
          </span>
          <span className="absolute -right-1 top-0 text-3xl text-amber-400">✦</span>
        </div>
        <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {unavailable ? "Our videos are temporarily unavailable." : "Our stories are coming to life."}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted sm:text-base">
          {unavailable
            ? "We couldn't load the videos. Please try again shortly, or explore our photo gallery."
            : "We have not added any videos yet. In the meantime, explore moments from our work in the photo gallery."}
        </p>
        <button type="button" onClick={onBrowsePhotos} className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          <Images size={19} aria-hidden="true" /> Browse photos
        </button>
        {unavailable && <button type="button" onClick={() => window.location.reload()} className="ml-4 mt-4 rounded-lg px-4 py-3 text-sm font-semibold text-primary underline">Try again</button>}
        <p className="mt-5 text-xs leading-6 text-muted">Real people. Meaningful moments.</p>
      </div>
    );
  }

  const featured = videos.find(video => video.featured) ?? videos[0];
  const remaining = videos.filter(video => video.id !== featured.id);

  return (
    <div className="mt-5 sm:mt-8">
      <article className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <button type="button" onClick={() => openVideo(featured)} aria-label={"Watch " + featured.title} className="group relative block aspect-video w-full overflow-hidden bg-slate-900 focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-primary">
          <Image src={featured.posterUrl} alt={featured.posterAlt} fill  sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.02]" />
          <span className="absolute left-4 top-4 rounded-full bg-slate-950/70 px-3 py-2 text-[10px] font-bold tracking-widest text-white sm:left-6 sm:top-6">FEATURED VIDEO</span>
          {featured.duration && <span className="absolute right-4 top-4 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white">{featured.duration}</span>}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-16 items-center justify-center rounded-full border border-white/80 bg-slate-950/25 text-white backdrop-blur-sm transition-colors group-hover:bg-primary/80 sm:size-24"><Play fill="currentColor" size={32} aria-hidden="true" /></span>
          </span>
        </button>
        <div className="pointer-events-none p-3.5 sm:p-5 md:absolute md:inset-x-0 md:bottom-0 md:bg-gradient-to-t md:from-slate-950/95 md:to-transparent md:p-8 md:pt-16">
          <h2 className="line-clamp-2 max-w-3xl font-serif text-lg font-bold leading-tight tracking-tight sm:text-2xl md:text-4xl md:text-white">{featured.title}</h2>
          <p className="mt-1.5 line-clamp-1 max-w-2xl text-xs leading-5 text-muted sm:mt-2 sm:text-sm md:text-white/90">{featured.description}</p>
          <button type="button" onClick={() => openVideo(featured)} className="pointer-events-auto mt-3 inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:w-auto">
            <Play size={17} fill="currentColor" aria-hidden="true" /> Watch the film <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </article>

      {remaining.length > 0 && (
        <section aria-labelledby="more-videos-heading" className="mt-6 sm:mt-10">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 sm:mb-5">
            <h2 id="more-videos-heading" className="font-serif text-xl font-bold tracking-tight sm:text-3xl">More moments to watch</h2>
            <p className="text-[10px] text-muted sm:text-xs">Latest uploads</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {remaining.map(video => (
              <button key={video.id} type="button" onClick={() => openVideo(video)} aria-label={"Watch " + video.title} className="group grid min-w-0 grid-cols-[88px_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 text-left transition-colors hover:border-blue-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:block sm:border-0 sm:bg-transparent sm:p-0">
                <span className="relative block aspect-square overflow-hidden rounded-xl bg-slate-100 sm:aspect-video">
                  <Image src={video.posterUrl} alt={video.posterAlt} fill  sizes="(min-width: 1024px) 390px, (min-width: 640px) 50vw, 88px" className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]" />
                  {video.duration && <span className="absolute right-2 top-2 rounded-md bg-slate-950/75 px-2 py-1 text-[10px] font-semibold text-white">{video.duration}</span>}
                  <span className="absolute bottom-2 right-2 flex size-8 items-center justify-center rounded-full bg-white text-primary"><Play size={15} fill="currentColor" aria-hidden="true" /></span>
                </span>
                <span className="block min-w-0 sm:mt-3">
                  <span className="line-clamp-2 font-serif text-base font-bold leading-5 group-hover:text-primary sm:text-lg sm:leading-tight">{video.title}</span>
                  <span className="mt-1 line-clamp-2 text-xs leading-4 text-muted sm:mt-2 sm:line-clamp-1 sm:text-sm sm:leading-5">{video.description}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <dialog ref={dialog} onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) setSelected(null); }} aria-labelledby="gallery-player-title" className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto rounded-2xl border-0 bg-slate-950 p-0 text-white shadow-2xl backdrop:bg-slate-950/80">
        {selected && <>
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <h2 id="gallery-player-title" className="text-base font-semibold">{selected.title}</h2>
            <button type="button" autoFocus onClick={() => setSelected(null)} aria-label="Close video" className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white"><X size={22} aria-hidden="true" /></button>
          </div>
          <video ref={player} key={selected.id} src={selected.videoUrl} poster={selected.posterUrl} controls autoPlay playsInline crossOrigin="anonymous" preload="metadata" onError={() => setPlayerError(true)} aria-label={selected.title} className="max-h-[65dvh] w-full bg-black">
            {selected.captionsUrl && <track kind="captions" src={selected.captionsUrl} label="Captions" default />}
          </video>
          {playerError && <p role="alert" className="px-5 pt-4 text-sm text-amber-200">This video could not be played. Please close it and try again, or check your connection.</p>}
          <p className="px-5 py-5 text-sm leading-7 text-slate-300">{selected.description}</p>
        </>}
      </dialog>
    </div>
  );
}
