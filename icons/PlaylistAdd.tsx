import { useState } from "react";

export const PlaylistAdd = ({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      <button
        id="PlaylistAdd"
        onClick={onClick}
        onMouseLeave={() => setIsHovering(false)}
        onMouseEnter={() => setIsHovering(true)}
        className="shadow-2xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`fill-current rounded-full bg-primary p-1 text-secondary w-14 h-14 ${className}`}
          enableBackground="new 0 0 24 24"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          fill="#000000"
        >
          <g>
            <rect fill="none" height="24" width="24" />
          </g>
          <g>
            <path d="M14,10H3v2h11V10z M14,6H3v2h11V6z M18,14v-4h-2v4h-4v2h4v4h2v-4h4v-2H18z M3,16h7v-2H3V16z" />
          </g>
        </svg>
        <span
          className={`text-primary font-monteserrat-light -ml-2 -mt-2 text-xs block transition-all duration-250 ${
            isHovering ? "opacity-80" : "opacity-0"
          }`}
        >
          Add tracks
        </span>
      </button>
    </>
  );
};

export default PlaylistAdd;
