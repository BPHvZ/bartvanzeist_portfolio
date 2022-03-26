import {css} from 'styled-components';

const variables = css`
  :root {
    --dark-slate: rgb(100 116 139);
    --slate: rgb(203 213 225);
    --light-slate: rgb(226 232 240);
    --lightest-slate: rgb(241 245 249);

    --oxford-blue: rgba(4, 27, 45, 1); //041b2d
    --oxford-blue-nav: rgba(4, 27, 45, 0.85);
    --oxford-blue-light: #073151;
    --oxford-blue-lightest: #0a4675;
    --oxford-blue-shadow: rgba(2,16,27, 0.7);
    --radical-red: rgba(255, 51, 102, 1); //ff3366
    --radical-red-tint: rgba(255, 51, 102, 0.1);
    --tiffany-blue: rgba(46, 196, 182, 1); //2ec4b6
    --cultured: rgba(246, 247, 248, 1); //f6f7f8
    --blue-jeans: rgba(32, 164, 243, 1); //20a4f3

    --font-sans: 'Calibre', 'Inter', 'San Francisco', 'SF Pro Text', -apple-system, system-ui,
      sans-serif;
    --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;

    --fz-xxs: 12px;
    --fz-xs: 13px;
    --fz-sm: 14px;
    --fz-md: 16px;
    --fz-lg: 18px;
    --fz-xl: 20px;
    --fz-xxl: 22px;
    --fz-heading: 32px;

    --border-radius: 4px;
    --nav-height: 100px;
    --nav-scroll-height: 70px;

    --tab-height: 42px;
    --tab-width: 120px;

    --easing: cubic-bezier(0.645, 0.045, 0.355, 1);
    --transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);

    --hamburger-width: 30px;

    --ham-before: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
    --ham-before-active: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
    --ham-after: bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    --ham-after-active: bottom 0.1s ease-out,
      transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  }
`;

export default variables;
