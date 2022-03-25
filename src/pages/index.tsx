import React from 'react';
import styled from 'styled-components';
import {About, Contact, Featured, Hero, Jobs, Layout, Projects} from '../components';
import {UrlObject} from 'url';

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

interface IndexPageProps {
  location: UrlObject;
}

const IndexPage: React.FC<IndexPageProps> = ({location}) => (
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
