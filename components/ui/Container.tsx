import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  width?: "standard" | "wide";
  className?: string;
};

export default function Container({
  children,
  width = "standard",
  className = "",
}: ContainerProps) {
  const maxWidth = width === "wide" ? "max-w-360" : "max-w-7xl";

  return (
    <div className={`mx-auto px-6 lg:px-10 ${maxWidth} ${className}`}>
      {children}
    </div>
  );
}
