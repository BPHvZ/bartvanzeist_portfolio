import ScrollReveal from 'scrollreveal';

const isSSR = typeof window === 'undefined';
// eslint-disable-next-line new-cap
const sr = isSSR ? null : ScrollReveal();

export default sr;
