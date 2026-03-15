import React, {useEffect, useState} from 'react';
import {createDrawable, createTimeline} from 'animejs';
import styled from 'styled-components';
import {IconLoader} from '../components/icons';

interface StyledLoaderProps {
  isMounted: boolean
}

const StyledLoader = styled.div<StyledLoaderProps>`
  ${({theme}) => theme.mixins.flexCenter};
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: var(--oxford-blue);
  z-index: 99;

  .logo-wrapper {
    width: max-content;
    max-width: 100px;
    transition: var(--transition);
    opacity: ${(props) => (props.isMounted ? 1 : 0)};
    svg {
      display: block;
      width: 100%;
      height: 100%;
      margin: 0 auto;
      fill: none;
      user-select: none;
      #B {
        opacity: 0;
      }
    }
  }
`;

interface LoaderProps {
  finishLoading: () => void,
}

const Loader = ({finishLoading}: LoaderProps) => {
  const [isMounted, setIsMounted] = useState(false);

  const animate = () => {
    const loader = createTimeline({
      onComplete: () => finishLoading(),
    });

    loader
        .add(createDrawable('#logo path'), {
          delay: 300,
          duration: 1500,
          ease: 'inOutQuart',
          draw: '0 1',
        })
        .add('#logo #B', {
          duration: 700,
          ease: 'inOutQuart',
          opacity: 1,
        })
        .add('#logo', {
          delay: 500,
          duration: 300,
          ease: 'inOutQuart',
          opacity: 0,
          scale: 0.1,
        })
        .add('.loader', {
          duration: 200,
          ease: 'inOutQuart',
          opacity: 0,
          zIndex: -1,
        });
  };

  useEffect(() => {
    document.body.classList.add('hidden');

    const timeout = setTimeout(() => setIsMounted(true), 10);
    animate();

    return () => {
      document.body.classList.remove('hidden');
      clearTimeout(timeout);
    };
  }, []);

  return (
    <StyledLoader className="loader" isMounted={isMounted}>
      <div className="logo-wrapper">
        <IconLoader />
      </div>
    </StyledLoader>
  );
};

export default Loader;
