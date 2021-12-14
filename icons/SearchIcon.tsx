import { useState } from "react";
import Link from "next/link";

export const SearchIcon = ({ className }: { className?: string }) => {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <Link href="/" passHref>
      <button
        id="SearchIcon"
        onMouseLeave={() => setIsHovering(false)}
        onMouseEnter={() => setIsHovering(true)}
      >
        <svg
          className={className || "fill-current text-secondary w-11 h-11"}
          viewBox="0 0 512 512"
          width="512px"
        >
          <path d="M344.5,298c15-23.6,23.8-51.6,23.8-81.7c0-84.1-68.1-152.3-152.1-152.3C132.1,64,64,132.2,64,216.3  c0,84.1,68.1,152.3,152.1,152.3c30.5,0,58.9-9,82.7-24.4l6.9-4.8L414.3,448l33.7-34.3L339.5,305.1L344.5,298z M301.4,131.2  c22.7,22.7,35.2,52.9,35.2,85c0,32.1-12.5,62.3-35.2,85c-22.7,22.7-52.9,35.2-85,35.2c-32.1,0-62.3-12.5-85-35.2  c-22.7-22.7-35.2-52.9-35.2-85c0-32.1,12.5-62.3,35.2-85c22.7-22.7,52.9-35.2,85-35.2C248.5,96,278.7,108.5,301.4,131.2z" />
        </svg>
      </button>
    </Link>
  );
};

export default SearchIcon;
