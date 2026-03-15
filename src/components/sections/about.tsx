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

  const skills = ['Swift', 'SwiftUI', 'iOS', 'Design Systems', 'Kotlin', 'Tooling'];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">Over mij</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              Hoi! Ik ben Bart en ik bouw graag software die technisch sterk in elkaar zit en prettig is om te gebruiken.
              Mijn interesse voor softwareontwikkeling begon op de middelbare school, waar ik mijzelf apps leerde maken met Swift.
              Sindsdien ben ik mij blijven verdiepen in mobiele ontwikkeling, architectuur en het slimmer maken van de ontwikkelervaring.
            </p>

            <p>
              Sinds september 2022 werk ik bij{' '}
              <a href="https://www.achmea.nl/">Achmea</a>, waar ik aan iOS-applicaties en platformoplossingen bouw.
              Daar combineer ik technische diepgang met samenwerken: van refactors, releases en incidenten tot het begeleiden van collega&apos;s,
              het delen van kennis en het afstemmen met stakeholders.
            </p>

            <p>
              Daarvoor heb ik tijdens mijn studie onder andere gewerkt voor{' '}
              <a href="https://www.pinkroccade-healthcare.nl/">PinkRoccade Healthcare</a>,{' '}
              <a href="https://www.zwolle.nl/">Gemeente Zwolle</a>{' '}en{' '}
              <a href="https://quintor.nl/">Quintor</a>. Ik werk graag aan uitdagende systemen waar techniek,
              product en samenwerking samenkomen.
            </p>

            <p>Hier zijn een aantal technieken en thema&apos;s waar ik de afgelopen tijd veel mee bezig ben geweest:</p>
          </div>

          <ul className="skills-list">
            {skills && skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/me-achmea.jpg"
              width={500}
              height={625}
              quality={95}
              formats={['auto', 'webp', 'avif']}
              imgStyle={{objectFit: 'cover', objectPosition: 'center top'}}
              alt="Headshot"
            />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
