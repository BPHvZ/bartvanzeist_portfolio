import React, {useEffect, useRef, useState} from 'react';
import type {PageProps} from 'gatsby';
import {Link} from 'gatsby';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import styled from 'styled-components';
import {Layout, Seo} from '../components';
import {usePrefersReducedMotion} from '../hooks';
import {navDelay} from '../utils';

const StyledMainContainer = styled.main`
  ${({theme}) => theme.mixins.flexCenter};
  flex-direction: column;
`;
const StyledTitle = styled.h1`
  color: var(--radical-red);
  font-family: var(--font-mono);
  font-size: clamp(100px, 25vw, 200px);
  line-height: 1;
`;
const StyledSubtitle = styled.h2`
  font-size: clamp(30px, 5vw, 50px);
  font-weight: 400;
`;
const StyledHomeButton = styled(Link)`
  ${({theme}) => theme.mixins.bigButton};
  margin-top: 40px;
`;

interface NotFoundPageProps {
  location: PageProps['location'];
}

const NotFoundPage = ({location}: NotFoundPageProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const content = (
    <StyledMainContainer ref={contentRef} className="fillHeight">
      <StyledTitle>404</StyledTitle>
      <StyledSubtitle>Page Not Found</StyledSubtitle>
      <StyledHomeButton to="/">Go Home</StyledHomeButton>
    </StyledMainContainer>
  );

  return (
    <Layout location={location}>
      {prefersReducedMotion ? (
        <>{content}</>
      ) : (
        <TransitionGroup component={null}>
          {isMounted && (
            <CSSTransition nodeRef={contentRef} timeout={500} classNames="fadeup">
              {content}
            </CSSTransition>
          )}
        </TransitionGroup>
      )}
    </Layout>
  );
};

export default NotFoundPage;

export const Head = ({location}: PageProps) => (
  <Seo pathname={location.pathname} title="Page Not Found" />
);
