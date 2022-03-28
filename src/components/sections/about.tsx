import React, {useEffect, useRef} from 'react';
import {StaticImage} from 'gatsby-plugin-image';
import styled from 'styled-components';
import {srConfig} from '../../config';
import sr from '../../utils/sr';
import {usePrefersReducedMotion} from '../../hooks';

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;
const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--radical-red);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;
const StyledPic = styled.div`
  position: relative;
  max-width: 300px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({theme}) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--radical-red);

    &:hover,
    &:focus {
      background: transparent;
      outline: 0;

      &:after {
        top: 15px;
        left: 15px;
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      background-color: var(--oxford-blue);
      mix-blend-mode: screen;
    }

    &:after {
      border: 2px solid var(--radical-red);
      top: 20px;
      left: 20px;
      z-index: -1;
    }
  }
`;

const About = () => {
  const revealContainer = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr?.reveal(revealContainer.current!, srConfig());
  }, []);

  const skills = ['TypeScript', 'React', 'Angular', 'Microsoft Azure', 'Spring Boot', 'Flutter'];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">Over mij</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              Hoi! Ik ben Bart en vind het leuk om apps en websites te bouwen.
              Ik ben leergierig en gebruik graag de nieuwste en modernste technieken.
              Mijn interesse voor software ontwikkeling begon op de middelbare school.
              Tijdens deze tijd heb ik mijzelf (iOS) apps leren maken met Swift en later met Flutter.
              Deze kennis heb ik tijdens mijn studie aangevuld met een hoop anderen tools, technieken en werkmethodes.
            </p>

            <p>
              Tijdens mijn studie heb ik onder andere projecten gedaan voor{' '}
              <a href="https://www.pinkroccade-healthcare.nl/">PinkRoccade Healthcare</a>,{' '}
              <a href="https://www.zwolle.nl/">Gemeente Zwolle</a>{' '}en{' '}
              <a href="https://quintor.nl/">Quintor</a>.{' '}
              Tijdens deze projecten heb ik in teams kunnen werken aan proof-of-concepts en MVP&apos;s.
              Hierin heb ik tools en technieken gebruikt zoals Angular, machine learning, Microsoft Azure en scrum.
            </p>

            <p>Hier zijn een aantal technieken waar ik de afgelopen tijd mee heb gewerkt:</p>
          </div>

          <ul className="skills-list">
            {skills && skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/me.jpg"
              width={500}
              quality={95}
              formats={['auto', 'webp', 'avif']}
              alt="Headshot"
            />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
