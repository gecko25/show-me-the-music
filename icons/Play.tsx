export const Play = ({ className }: { className?: string }) => {
  return (
    <button id="PlayBtn">
      <svg
        height="48"
        viewBox="0 0 48 48"
        width="48"
        xmlns="http://www.w3.org/2000/svg"
        className={
          className ||
          "pt-2 fill-current text-secondary w-12 h-12 lg:w-20 lg:h-20"
        }
      >
        <path d="M0 0h48v48H0z" fill="none" />
        <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm-4 29V15l12 9-12 9z" />
      </svg>
    </button>
  );
};

export default Play;
