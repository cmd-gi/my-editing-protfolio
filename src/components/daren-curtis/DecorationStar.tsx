export function DecorationStar({
  className = "w-12 h-10",
  fill = "#CEFF00",
  stroke = "#151010",
}: {
  className?: string;
  fill?: string;
  stroke?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 78 62"
      fill="none"
      className={className}
    >
      <path
        d="M75.5102 58.1164C50.2012 33.9053 48.5421 29.3022 57.7808 8.87277C58.0411 8.29535 57.8784 7.60407 57.3742 7.2137C56.87 6.8152 56.1706 6.82333 55.6663 7.2137C38.0265 21.0475 33.1631 20.5351 3.62507 1.71598C3.03138 1.33374 2.23437 1.472 1.7952 2.03316C1.35604 2.59431 1.41297 3.39132 1.92533 3.88742C27.2344 28.0985 28.8853 32.7016 19.6465 53.131C19.3863 53.7085 19.5489 54.3997 20.0532 54.7901C20.1751 54.8877 20.3134 54.9609 20.4517 55.0097C20.8908 55.1642 21.3869 55.091 21.761 54.7901C39.4009 40.9563 44.2724 41.4768 73.8104 60.2878C74.4041 60.6619 75.2011 60.5318 75.6403 59.9788C76.0795 59.4258 76.0225 58.6125 75.5102 58.1245V58.1164Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
        strokeMiterlimit="10"
      />
    </svg>
  );
}

export function ShakaSticker({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center select-none text-2xl ${className}`}>
      🤙
    </span>
  );
}
