import { useState } from "react";

export const PlaylistAddCheck = ({ className }: { className?: string }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      <button
        id="PlaylistAddCheck"
        onMouseLeave={() => setIsHovering(false)}
        onMouseEnter={() => setIsHovering(true)}
        className="shadow-2xl"
      >
        <svg
          className={`fill-current bg-primary p-1 rounded-full text-secondary w-14 h-14 ${className}`}
          xmlns="http://www.w3.org/2000/svg"
          enableBackground="new 0 0 24 24"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
        >
          <g>
            <rect fill="none" height="24" width="24" />
          </g>
          <g>
            <g>
              <rect height="2" width="11" x="3" y="10" />
              <rect height="2" width="11" x="3" y="6" />
              <rect height="2" width="7" x="3" y="14" />
              <polygon points="20.59,11.93 16.34,16.17 14.22,14.05 12.81,15.46 16.34,19 22,13.34" />
            </g>
          </g>
        </svg>
        <span
          className={`text-primary font-monteserrat-light -ml-2 -mt-2 text-xs block transition-all duration-250 ${
            isHovering ? "opacity-80" : "opacity-0"
          }`}
        >
          Tracks added
        </span>
      </button>
    </>
  );
};

export default PlaylistAddCheck;
