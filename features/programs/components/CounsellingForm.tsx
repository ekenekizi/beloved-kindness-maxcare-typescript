"use client";

import { useFormStepFocus } from "@/lib/use-form-step-focus";

import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, HeartHandshake, ShieldCheck } from "lucide-react";
import ShareForm from "@/components/ui/ShareForm";
import SectionLabel from "@/components/ui/SectionLabel";
import { submitEnquiry } from "@/features/get-involved/data/submit-enquiry";

const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";
const fields = [
  { name: "parentName", label: "Parent or guardian's full name", type: "text", autoComplete: "name", maxLength: 150 },
  { name: "email", label: "Email address", type: "email", autoComplete: "email", maxLength: 254 },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel", maxLength: 40 },
  { name: "childFirstName", label: "Child's first name only", type: "text", autoComplete: "off", maxLength: 80 },
] as const;

export default function CounsellingForm() {
  const sending = useRef(false);
  const submissionId = useRef<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const successRef = useFormStepFocus<HTMLDivElement>(submitted);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const data = {
      parentName: String(values.get("parentName") ?? ""),
      email: String(values.get("email") ?? ""),
      phone: String(values.get("phone") ?? ""),
      childFirstName: String(values.get("childFirstName") ?? ""),
      childAge: Number(values.get("childAge")),
      contactMethod: String(values.get("contactMethod") ?? ""),
      guardian: values.get("guardian") === "on",
      consent: values.get("consent") === "on",
    };
    sending.current = true;
    setBusy(true);
    setError("");
    try {
      submissionId.current ??= crypto.randomUUID();
      await submitEnquiry("counselling", data, submissionId.current, honeypot.current?.value ?? "");
      form.reset();
      submissionId.current = null;
      setSubmitted(true);

    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn't send your request. Please try again.");
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }

  return (
    <section id="child-counselling" aria-labelledby="counselling-heading" className="scroll-mt-28 bg-blue-50/50 py-14 sm:py-20">
      <div className="mx-auto grid max-w-[1120px] gap-10 px-5 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:px-10">
        <div>
          <SectionLabel>A space to be heard</SectionLabel>
          <h2 id="counselling-heading" className="mt-5 font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Support for learning.<br /><span className="text-primary">Care for their wellbeing.</span></h2>
          <p className="mt-5 text-base leading-8 text-muted">Alongside education support, our qualified counsellors offer a caring space for children and their families. A parent or legal guardian can request an initial conversation using this form.</p>
          <ol className="mt-8 space-y-5">
            {[
              ["Request a conversation", "Share your contact details and your child's first name and age."],
              ["Hear from our team", "We will contact you to discuss the service, availability and next steps."],
              ["Plan the appropriate support", "The counsellor will explain the intake process and obtain any further consent before counselling begins."],
            ].map(([title, description], index) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-primary">{index + 1}</span>
                <div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-7 text-muted">{description}</p></div>
              </li>
            ))}
          </ol>
          <p className="mt-8 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-7 text-muted">This form requests contact; it does not book an appointment. It is not monitored for emergencies. If a child is in immediate danger, contact local emergency services or seek urgent in-person help.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(19,44,64,0.06)] sm:p-8">
          {submitted ? (
            <div ref={successRef} tabIndex={-1} role="status" className="scroll-mt-32 rounded-2xl bg-green-50 p-6 outline-none">
              <HeartHandshake className="text-green-700" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-2xl font-bold">Your request has been sent.</h3>
              <p className="mt-3 text-sm leading-7 text-muted">Our team will contact you using the details you provided to discuss availability and next steps. An appointment has not yet been booked.</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <ShareForm title="Request child counselling with BKM" path="/programs/education#child-counselling" />
              <h3 className="font-serif text-2xl font-bold">Request child counselling</h3>
              <p className="mt-2 text-sm leading-7 text-muted">For children under 18. All fields are required.</p>
              <fieldset disabled={busy} className="mt-6 space-y-5 disabled:opacity-70">
                <legend className="sr-only">Parent and child contact request</legend>
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="counselling-website">Leave this field empty</label>
                  <input ref={honeypot} id="counselling-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {fields.map(({ label, ...field }) => (
                    <label key={field.name} className="block text-sm font-semibold">
                      {label}
                      <input {...field} required className={inputClass} />
                    </label>
                  ))}
                  <label className="block text-sm font-semibold">Child’s age (years)
                    <input name="childAge" type="number" min={0} max={17} step={1} required className={inputClass} />
                  </label>
                  <label className="block text-sm font-semibold">Preferred contact method
                    <select name="contactMethod" required defaultValue="" className={inputClass}>
                      <option value="" disabled>Select a method</option>
                      <option>Email</option><option>Phone</option>
                    </select>
                  </label>
                </div>
                <div id="counselling-privacy" className="rounded-xl bg-slate-50 p-4 text-sm leading-7 text-muted">
                  <ShieldCheck size={20} className="mb-2 text-primary" aria-hidden="true" />
                  These details will be emailed to our designated counselling contact to respond to your request. Do not submit diagnoses, counselling histories or sensitive documents. The counsellor will discuss any further information directly with you.
                </div>
                <label className="flex items-start gap-3 text-sm leading-6">
                  <input name="guardian" type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-primary" />
                  I confirm that I am this child’s parent or legal guardian.
                </label>
                <label className="flex items-start gap-3 text-sm leading-6">
                  <input name="consent" type="checkbox" required aria-describedby="counselling-privacy" className="mt-1 h-4 w-4 shrink-0 accent-primary" />
                  I agree that BKM may use these details to contact me about this counselling request.
                </label>
                {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
                <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-wait">
                  {busy ? "Sending request..." : "Send counselling request"}<ArrowRight size={18} aria-hidden="true" />
                </button>
              </fieldset>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
