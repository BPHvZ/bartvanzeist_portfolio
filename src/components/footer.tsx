import React from 'react';
import styled from 'styled-components';
import {socialMedia} from '../config';
import {Icon} from '../components/icons';

const StyledFooter = styled.footer`
  ${({theme}) => theme.mixins.flexCenter};
  flex-direction: column;
  height: auto;
  min-height: 70px;
  padding: 15px;
  text-align: center;
`;

const StyledSocialLinks = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    max-width: 270px;
    margin: 0 auto 10px;
    color: var(--light-slate);
  }

  ul {
    ${({theme}) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    a {
      padding: 10px;
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
`;

const StyledCredit = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--light-slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  line-height: 1;

  a {
    padding: 10px;
  }
`;

const Footer = () => (
  <StyledFooter>
    <StyledSocialLinks>
      <ul>
        {socialMedia &&
          socialMedia.map(({name, url}, i) => (
            <li key={i}>
              <a href={url} aria-label={name}>
                <Icon name={name} />
              </a>
            </li>
          ))}
      </ul>
    </StyledSocialLinks>

    <StyledCredit tabIndex={-1}>
      <a href="https://github.com/BPHvZ/bartvanzeist_portfolio" target="_blank" rel="noreferrer">
        Gemaakt door Bart van Zeist
      </a>
    </StyledCredit>
  </StyledFooter>
);
export default Footer;
