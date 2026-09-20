import styles from "./volcano-hero.module.css";

export function VolcanoHero() {
  return (
    <div aria-hidden="true" className={styles.root}>
      <svg
        className={styles.svg}
        focusable="false"
        viewBox="0 0 256 256"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Decorative erupting volcano</title>
        <defs>
          <mask id="hero-volcano-lava-reveal" maskUnits="userSpaceOnUse">
            <rect
              className={styles.lavaMask}
              fill="white"
              height="76"
              width="58"
              x="83"
              y="104"
            />
          </mask>
        </defs>

        <ellipse
          className={styles.shadow}
          cx="128"
          cy="224"
          fill="currentColor"
          opacity="0.2"
          rx="88"
          ry="13"
        />

        <g className={styles.volcano} stroke="none" strokeLinejoin="round">
          <g className={styles.mountain}>
            <path fill="#79737f" d="M28 172 94 96 128 116 128 230Z" />
            <path fill="#46434f" d="M128 116 162 96 228 172 128 230Z" />
          </g>

          <g className={styles.lava}>
            <path
              className={styles.lavaFlow}
              d="M116 109 128 116 121 136 108 143 107 160 92 169 98 137 112 129Z"
              fill="#f08354"
              mask="url(#hero-volcano-lava-reveal)"
            />
            <path
              className={styles.lavaHighlight}
              d="M116 109 123 114 117 133 106 141 103 153"
              fill="none"
              mask="url(#hero-volcano-lava-reveal)"
              stroke="#ffc078"
              strokeLinecap="round"
              strokeWidth="4"
            />
            <path fill="#f08354" d="M128 76 162 96 128 116 94 96Z" />
            <path fill="#9b4538" d="M128 85 148 97 128 109 108 97Z" />
            <path
              className={styles.craterGlow}
              fill="#ffc078"
              d="M128 97 138 103 128 109 118 103Z"
            />
          </g>
        </g>

        <g className={styles.smoke} stroke="none" strokeLinejoin="round">
          <path fill="#d5c6bc" d="M119 34 136 44 136 64 119 54Z" />
          <path fill="#ada0a1" d="M136 44 153 34 153 54 136 64Z" />
          <path fill="#efe4d8" d="M136 24 153 34 136 44 119 34Z" />
        </g>

        <g className={styles.smokeEcho} stroke="none" strokeLinejoin="round">
          <path fill="#d5c6bc" d="m103 53 10 6v12l-10-6Z" />
          <path fill="#ada0a1" d="m113 59 10-6v12l-10 6Z" />
          <path fill="#efe4d8" d="m113 47 10 6-10 6-10-6Z" />
        </g>

        <g className={styles.particles} fill="#ffc078">
          <path className={styles.particleOne} d="m119 88 6-4 6 4-6 4Z" />
          <path className={styles.particleTwo} d="m139 91 5-3 5 3-5 3Z" />
          <path className={styles.particleThree} d="m128 84 4-3 4 3-4 3Z" />
          <path
            className={styles.particleFour}
            d="m108 94 4-2.5 4 2.5-4 2.5Z"
          />
        </g>
      </svg>
    </div>
  );
}
