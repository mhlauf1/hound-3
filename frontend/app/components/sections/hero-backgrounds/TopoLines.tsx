export default function TopoLines() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Innermost contour */}
        <path
          d="M870 520 C890 490, 940 470, 960 500 C980 530, 950 560, 920 555 C890 550, 855 545, 870 520Z"
          stroke="rgba(232,120,48,0.10)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Second contour */}
        <path
          d="M830 540 C840 480, 920 440, 990 480 C1060 520, 1030 590, 970 600 C910 610, 860 590, 830 540Z"
          stroke="rgba(232,120,48,0.09)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Third contour */}
        <path
          d="M790 570 C800 460, 900 400, 1030 440 C1160 480, 1130 620, 1020 650 C910 680, 820 650, 790 570Z"
          stroke="rgba(232,120,48,0.09)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Fourth contour */}
        <path
          d="M740 590 C750 430, 870 350, 1070 400 C1270 450, 1240 660, 1080 710 C920 760, 770 700, 740 590Z"
          stroke="rgba(232,120,48,0.08)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Fifth contour */}
        <path
          d="M680 620 C690 400, 840 290, 1120 360 C1400 430, 1360 710, 1140 770 C920 830, 710 760, 680 620Z"
          stroke="rgba(232,120,48,0.08)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Outermost contour */}
        <path
          d="M620 660 C630 370, 800 230, 1160 310 C1520 390, 1470 750, 1200 830 C930 910, 650 820, 620 660Z"
          stroke="rgba(232,120,48,0.07)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
