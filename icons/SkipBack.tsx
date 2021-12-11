export const SkipBack = ({ className }: { className?: string }) => {
  return (
    <button id="SkipBackBtn">
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={className || "pt-2 fill-current text-secondary w-11 h-11"}
      >
        <g>
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M8 11.333l10.223-6.815a.5.5 0 0 1 .777.416v14.132a.5.5 0 0 1-.777.416L8 12.667V19a1 1 0 0 1-2 0V5a1 1 0 1 1 2 0v6.333z" />
        </g>
      </svg>
    </button>
  );
};

export default SkipBack;
