"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";

type Option = { value: string; label: string };
type Props = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  disabled?: boolean;
  align?: "left" | "right";
};

export default function GalleryDropdown({ label, value, options, onChange, disabled = false, align = "left" }: Props) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const search = useRef({ text: "", time: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const selected = options.findIndex(option => option.value === value);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: Event) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("focusin", closeOutside);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("focusin", closeOutside);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    root.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [active, open]);

  function choose(index: number) {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }

  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Tab") { setOpen(false); return; }
    if (event.key === "Escape") { if (open) event.preventDefault(); setOpen(false); return; }
    if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      if (!open) {
        setActive(event.key === "End" ? options.length - 1 : selected >= 0 ? selected : 0);
        setOpen(true);
      } else if (event.key === "Enter" || event.key === " ") choose(active);
      else if (event.key === "Home") setActive(0);
      else if (event.key === "End") setActive(options.length - 1);
      else setActive(index => (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
      return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = Date.now();
      search.current.text = (now - search.current.time < 700 ? search.current.text : "") + event.key.toLowerCase();
      search.current.time = now;
      const match = options.findIndex(option => option.label.toLowerCase().startsWith(search.current.text));
      if (match >= 0) { event.preventDefault(); setActive(match); setOpen(true); }
    }
  }

  return (
    <div ref={root} className={"relative min-w-0 " + (open ? "z-30" : "")}>
      <span id={id + "-label"} className="mb-2 block text-[10px] font-semibold tracking-wider text-foreground uppercase sm:text-xs">{label}</span>
      <button ref={trigger} type="button" role="combobox" aria-haspopup="listbox"
        aria-expanded={open} aria-controls={id + "-list"}
        aria-labelledby={id + "-label"}
        aria-activedescendant={open ? id + "-option-" + active : undefined}
        disabled={disabled || !options.length}
        onKeyDown={keyDown}
        onClick={() => { setActive(selected >= 0 ? selected : 0); setOpen(previous => !previous); }}
        className={"flex min-h-12 w-full min-w-0 items-center justify-between gap-3 rounded-xl border bg-white px-3 py-3 text-left text-sm font-medium text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 sm:px-4 " + (open ? "border-primary ring-2 ring-primary/10" : "border-slate-200 hover:border-blue-300")}>
        <span className="truncate">{options[selected]?.label ?? "No albums"}</span>
        <ChevronDown size={17} aria-hidden="true" className={"shrink-0 text-muted transition-transform " + (open ? "rotate-180" : "")} />
      </button>
      {open && (
        <ul id={id + "-list"} role="listbox" aria-labelledby={id + "-label"}
          className={"absolute top-full mt-2 max-h-64 min-w-full max-w-[calc(100vw-2rem)] overflow-y-auto overscroll-contain rounded-xl border border-blue-100 bg-white p-1.5 shadow-[0_12px_35px_rgba(19,44,64,0.16)] " + (align === "right" ? "right-0 w-max" : "left-0 w-max")}>
          {options.map((option, index) => (
            <li id={id + "-option-" + index} key={option.value} role="option"
              aria-selected={option.value === value} data-active={active === index}
              onPointerMove={() => setActive(index)}
              onMouseDown={event => event.preventDefault()}
              onClick={() => choose(index)}
              className={"flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-3 text-sm leading-5 transition-colors " + (option.value === value ? "bg-blue-50 font-semibold text-primary" : active === index ? "bg-slate-50 text-foreground" : "text-foreground")}>
              <span>{option.label}</span>
              <Check size={18} aria-hidden="true" className={"shrink-0 text-primary " + (option.value === value ? "" : "invisible")} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
