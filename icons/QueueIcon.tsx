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
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24px"
          fill="#000000"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 10h9v2H5zm0-3h9v2H5z" />
        </svg>
        <span
          className={`text-secondary font-monteserrat-light text-xs block transition-all duration-250 ${
            isHovering ? "opacity-80" : "opacity-0"
          }`}
        >
          Queue
        </span>
      </button>
    </Link>
  );
};

export default Queue;
