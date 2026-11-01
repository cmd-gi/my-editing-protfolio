export function ArrowIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 10"
      fill="none"
      className={`transition-transform duration-200 group-hover:translate-x-1 ${className}`}
    >
      <path
        d="M12.3333 4.96191H1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.62988 9L13.0002 4.9619L8.62988 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
