import React from 'react';
import type {PageProps} from 'gatsby';
import styled from 'styled-components';
import {About, Contact, Featured, Hero, Jobs, Layout, Projects, Seo} from '../components';

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

interface IndexPageProps {
  location: PageProps['location'];
}

const IndexPage = ({location}: IndexPageProps) => (
  <Layout location={location}>
    <StyledMainContainer className="fillHeight">
      <Hero />
      <About />
      <Jobs />
      <Featured />
      <Projects />
      <Contact />
    </StyledMainContainer>
  </Layout>
);

export default IndexPage;

export const Head = ({location}: PageProps) => <Seo pathname={location.pathname} />;
