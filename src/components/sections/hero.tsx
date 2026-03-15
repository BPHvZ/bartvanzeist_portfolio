import React, {useEffect, useRef, useState} from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import styled from 'styled-components';
import {loaderDelay, navDelay} from '../../utils';
import {usePrefersReducedMotion} from '../../hooks';
import {Link} from 'gatsby';

const StyledHeroSection = styled.section`
  ${({theme}) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  padding: 0;

  @media (max-width: 480px) and (min-height: 700px) {
    padding-bottom: 10vh;
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--radical-red);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 10px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${({theme}) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <h1>Hoi 👋, ik ben</h1>;
  const two = <h2 className="big-heading">Bart van Zeist.</h2>;
  const three = <h3 className="big-heading">Een software engineer met een focus op iOS.</h3>;
  const four = (
    <>
      <p>
        Ik werk sinds september 2022 bij{' '}
        <a href="https://www.achmea.nl/" target="_blank" rel="noreferrer">
          Achmea
        </a>
        {' '}aan mobiele producten en platformoplossingen. Ik haal energie uit technisch uitdagende
        vraagstukken, design systems en het samenwerken met teams en stakeholders om ideeën om te zetten in sterke software.
      </p>
    </>
  );
  const five = (
    <Link className="email-link" to={'/#about'}>{'Meer over mij'}</Link>
  );

  const items = [one, two, three, four, five];
  const itemRefs = useRef(items.map(() => React.createRef<HTMLDivElement>()));

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => {
              const nodeRef = itemRefs.current[i];

              return (
                <CSSTransition key={i} nodeRef={nodeRef} classNames="fadeup" timeout={loaderDelay}>
                  <div ref={nodeRef} style={{transitionDelay: `${i + 1}00ms`}}>{item}</div>
                </CSSTransition>
              );
            })}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
