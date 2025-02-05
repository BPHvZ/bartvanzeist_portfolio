import React, {useEffect, useRef} from 'react';
import styled from 'styled-components';
import {email, srConfig} from '../../config';
import sr from '../../utils/sr';
import {usePrefersReducedMotion} from '../../hooks';

const StyledContactSection = styled.section`
  max-width: 600px;
  margin: 0 auto 100px;
  text-align: center;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
  }

  .overline {
    display: block;
    margin-bottom: 20px;
    color: var(--radical-red);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: 400;

    &:before {
      bottom: 0;
      font-size: var(--fz-sm);
    }

    &:after {
      display: none;
    }
  }

  .title {
    font-size: clamp(40px, 5vw, 60px);
  }

  .email-link {
    ${({theme}) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const Contact = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr?.reveal(revealContainer.current!, srConfig());
  }, []);

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">Wat nu?</h2>

      <h2 className="title">Stuur een berichtje</h2>

      <p>
        Op dit moment sta ik open voor nieuwe ervaringen en ben ik op zoek naar mijn eerst baan na mijn afstuderen.
        Stuur en berichtje en laten we kijken of we iets voor elkaar kunnen betekenen.
      </p>

      <a className="email-link" href={`mailto:${email}`}>
        Schrijf een mailtje
      </a>
    </StyledContactSection>
  );
};

export default Contact;
