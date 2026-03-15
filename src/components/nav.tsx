import React, {useEffect, useRef, useState} from 'react';
import {Link} from 'gatsby';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import styled, {css} from 'styled-components';
import {navLinks} from '../config';
import {loaderDelay} from '../utils';
import {usePrefersReducedMotion, useScrollDirection} from '../hooks';
import {Menu} from '../components';
import {IconLogo} from '../components/icons';

interface StyledHeaderProps {
  scrollDirection: 'up' | 'down';
  scrolledToTop: boolean
}

const StyledHeader = styled.header<StyledHeaderProps>`
  ${({theme}) => theme.mixins.flexBetween};
  position: fixed;
  top: 0;
  z-index: 11;
  padding: 0px 50px;
  width: 100%;
  height: var(--nav-height);
  background-color: var(--oxford-blue-nav);
  filter: none !important;
  pointer-events: auto !important;
  user-select: auto !important;
  backdrop-filter: blur(10px);
  transition: var(--transition);

  @media (max-width: 1080px) {
    padding: 0 40px;
  }
  @media (max-width: 768px) {
    padding: 0 25px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${(props) =>
    props.scrollDirection === 'up' &&
    !props.scrolledToTop &&
    css`
        height: var(--nav-scroll-height);
        transform: translateY(0px);
        background-color: var(--oxford-blue-nav);
        box-shadow: 0 10px 30px -10px var(--navy-shadow);
      `};

    ${(props) =>
    props.scrollDirection === 'down' &&
    !props.scrolledToTop &&
    css`
        height: var(--nav-scroll-height);
        transform: translateY(calc(var(--nav-scroll-height) * -1));
        box-shadow: 0 10px 30px -10px var(--navy-shadow);
      `};
  }
`;

const StyledNav = styled.nav`
  ${({theme}) => theme.mixins.flexBetween};
  position: relative;
  width: 100%;
  color: var(--lightest-slate);
  font-family: var(--font-mono);
  counter-reset: item 0;
  z-index: 12;

  .logo {
    ${({theme}) => theme.mixins.flexCenter};

    a {
      color: var(--radical-red);
      width: 42px;
      height: 42px;

      &:hover,
      &:focus {
        svg {
          fill: var(--radical-red-tint);
        }
      }

      svg {
        fill: none;
        transition: var(--transition);
        user-select: none;
      }
    }
  }
`;

const StyledLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }

  ol {
    ${({theme}) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      margin: 0 5px;
      position: relative;
      counter-increment: item 1;
      font-size: var(--fz-xs);

      a {
        padding: 10px;

        &:before {
          content: '0' counter(item) '.';
          margin-right: 5px;
          color: var(--radical-red);
          font-size: var(--fz-xxs);
          text-align: right;
        }
      }
    }
  }

  .resume-button {
    ${({theme}) => theme.mixins.smallButton};
    margin-left: 15px;
    font-size: var(--fz-xs);
  }
`;

interface NavProps {
  isHome: boolean;
}

const Nav = ({isHome}: NavProps) => {
  const [isMounted, setIsMounted] = useState(!isHome);
  const scrollDirection = useScrollDirection('down');
  const [scrolledToTop, setScrolledToTop] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();
  const logoRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef(navLinks.map(() => React.createRef<HTMLLIElement>()));

  const handleScroll = () => {
    setScrolledToTop(window.scrollY < 50);
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const timeout = isHome ? loaderDelay : 0;
  const fadeClass = isHome ? 'fade' : '';
  const fadeDownClass = isHome ? 'fadedown' : '';

  const Logo = (
    <div ref={logoRef} className="logo" tabIndex={-1}>
      {isHome ? (
        <a href="/" aria-label="home">
          <IconLogo />
        </a>
      ) : (
        <Link to="/" aria-label="home">
          <IconLogo />
        </Link>
      )}
    </div>
  );

  const ResumeLink = (
    <a className="resume-button" href="/CV_-_Bart_van_Zeist.pdf" target="_blank" rel="noopener noreferrer">
      Bekijk CV
    </a>
  );

  return (
    <StyledHeader scrollDirection={scrollDirection} scrolledToTop={scrolledToTop}>
      <StyledNav>
        {prefersReducedMotion ? (
          <>
            {Logo}

            <StyledLinks>
              <ol>
                {navLinks &&
                  navLinks.map(({url, name}, i) => (
                    <li key={i}>
                      <Link to={url}>{name}</Link>
                    </li>
                  ))}
              </ol>
              <div>{ResumeLink}</div>
            </StyledLinks>

            <Menu />
          </>
        ) : (
          <>
            <TransitionGroup component={null}>
              {isMounted && (
                <CSSTransition nodeRef={logoRef} classNames={fadeClass} timeout={timeout}>
                  {Logo}
                </CSSTransition>
              )}
            </TransitionGroup>

            <StyledLinks>
              <ol>
                <TransitionGroup component={null}>
                  {isMounted &&
                    navLinks &&
                    navLinks.map(({url, name}, i) => {
                      const nodeRef = navItemRefs.current[i];

                      return (
                        <CSSTransition key={i} nodeRef={nodeRef} classNames={fadeDownClass} timeout={timeout}>
                          <li ref={nodeRef} key={i} style={{transitionDelay: `${isHome ? i * 100 : 0}ms`}}>
                            <Link to={url}>{name}</Link>
                          </li>
                        </CSSTransition>
                      );
                    })}
                </TransitionGroup>
              </ol>

              <TransitionGroup component={null}>
                {isMounted && (
                  <CSSTransition nodeRef={resumeRef} classNames={fadeDownClass} timeout={timeout}>
                    <div ref={resumeRef} style={{transitionDelay: `${isHome ? navLinks.length * 100 : 0}ms`}}>
                      {ResumeLink}
                    </div>
                  </CSSTransition>
                )}
              </TransitionGroup>
            </StyledLinks>

            <TransitionGroup component={null}>
              {isMounted && (
                <CSSTransition nodeRef={menuRef} classNames={fadeClass} timeout={timeout}>
                  <div ref={menuRef}>
                    <Menu />
                  </div>
                </CSSTransition>
              )}
            </TransitionGroup>
          </>
        )}
      </StyledNav>
    </StyledHeader>
  );
};

export default Nav;
