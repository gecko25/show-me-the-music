import { useState } from "react";
import Link from "next/link";

export const Queue = ({ className }: { className?: string }) => {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <Link href="/queue" passHref>
      <button
        id="QueueIcon"
        onMouseLeave={() => setIsHovering(false)}
        onMouseEnter={() => setIsHovering(true)}
      >
        <svg
          className={className || "pt-2 fill-current text-secondary w-11 h-11"}
          height="48"
          viewBox="0 0 48 48"
          width="48"
        >
          <path d="M0 0h48v48H0z" fill="none" />
          <path d="M30 12H6v4h24v-4zm0 8H6v4h24v-4zM6 32h16v-4H6v4zm28-20v16.37c-.63-.23-1.29-.37-2-.37-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6V16h6v-4H34z" />
        </svg>

        {/*
              <span
          className={`text-secondary font-monteserrat-light text-xs block transition-all duration-250 ${
            isHovering ? "opacity-80" : "opacity-0"
          }`}
        >
          Queue
        </span>
    */}
      </button>
    </Link>
  );
};

export default Queue;
