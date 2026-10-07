import type { ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
  align?: "left" | "center";
  className?: string;
};

const textStyles =
  "text-primary text-sm font-semibold tracking-[0.25em] uppercase";

export default function SectionLabel({
  children,
  align = "left",
  className = "",
}: SectionLabelProps) {
  if (align === "center") {
    return (
      <p
        className={`${textStyles} flex items-center justify-center gap-2 ${className}`}
      >
        <span
          aria-hidden="true"
          className="bg-primary inline-block h-px w-5 rounded-md"
        />

        {children}

        <span
          aria-hidden="true"
          className="bg-primary inline-block h-px w-5 rounded-md"
        />
      </p>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span
        aria-hidden="true"
        className="bg-primary h-px w-10 shrink-0 rounded-full"
      />

      <p className={textStyles}>{children}</p>
    </div>
  );
}
