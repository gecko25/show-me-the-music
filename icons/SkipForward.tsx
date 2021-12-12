export const SkipForward = ({ className }: { className?: string }) => {
  return (
    <button id="SkipForwardIcon">
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={className || "pt-2 fill-current text-secondary-dark w-8 h-8"}
      >
        <g>
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M16 12.667L5.777 19.482A.5.5 0 0 1 5 19.066V4.934a.5.5 0 0 1 .777-.416L16 11.333V5a1 1 0 0 1 2 0v14a1 1 0 0 1-2 0v-6.333z" />
        </g>
      </svg>
    </button>
  );
};

export default SkipForward;
