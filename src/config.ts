export const email = 'bartvanzeist2000@gmail.com';
export const socialMedia = [
  {
    name: 'Linkedin',
    url: 'https://linkedin.com/in/bart-van-zeist-543442193',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/BPHvZ',
  },
];
export const navLinks = [
  {
    name: 'Over mij',
    url: '/#about',
  },
  {
    name: 'Ervaring',
    url: '/#jobs',
  },
  {
    name: 'Projecten',
    url: '/#projects',
  },
  {
    name: 'Contact',
    url: '/#contact',
  },
];
export const colors = {
  pink: '#ff3366',
  navy: '#041b2d',
  darkNavy: '#020c1b',
};
export function srConfig(delay = 200, viewFactor = 0.25) {
  return {
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: {x: 0, y: 0, z: 0},
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor,
    viewOffset: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  };
}
