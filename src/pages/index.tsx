import React from 'react';
import styled from 'styled-components';
import {About, Contact, Featured, Hero, Jobs, Layout, Projects} from '../components';
import {WindowLocation} from '@reach/router';

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

interface IndexPageProps {
  location: WindowLocation;
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
