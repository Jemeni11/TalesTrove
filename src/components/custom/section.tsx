import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "~lib/utils";

export default function Section({
  title,
  children,
  expanded,
  onToggle
}: {
  title: string;
  children: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (expanded) {
      const contentEl = contentRef.current;
      if (contentEl) {
        setHeight(contentEl.scrollHeight);
      }
    } else {
      setHeight(0);
    }
  }, [expanded]);

  return (
    <div
      className={`mb-4 border border-input rounded-lg overflow-hidden ${expanded ? "bg-accent" : ""}`}>
      <button
        className="w-full p-3 text-left font-medium bg-background hover:bg-accent transition-colors flex justify-between items-center"
        onClick={onToggle}>
        {title}
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-300",
            expanded ? "transform rotate-180" : ""
          )}
        />
      </button>
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{ height: `${height}px` }}>
        <div ref={contentRef}>
          <div className="p-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
