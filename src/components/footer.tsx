import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Icon} from '../components/icons';
import {socialMedia} from '../config';

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

  .github-stats {
    margin-top: 10px;

    & > span {
      display: inline-flex;
      align-items: center;
      margin: 0 7px;
    }
    svg {
      display: inline-block;
      margin-right: 5px;
      width: 14px;
      height: 14px;
    }
  }
`;

interface GitHubRepoResponse {
  stargazers_count: number;
  forks_count: number;
}

const Footer = () => {
  const [githubInfo, setGitHubInfo] = useState<GitHubRepoResponse>({
    stargazers_count: 0,
    forks_count: 0,
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    fetch('https://api.github.com/repos/BPHvZ/bartvanzeist_portfolio')
        .then((response) => response.json())
        .then((data: GitHubRepoResponse) => {
          setGitHubInfo({
            stargazers_count: data.stargazers_count,
            forks_count: data.forks_count,
          });
        })
        .catch((e) => console.error(e));
  }, []);

  return (
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
        <a href="https://github.com/BPHvZ/bartvanzeist_portfolio">
          <div>Gemaakt door Bart van Zeist</div>

          {githubInfo.stargazers_count > 0 || githubInfo.forks_count > 0 && (
            <div className="github-stats">
              <span>
                <Icon name="Star" />
                <span>{githubInfo.stargazers_count.toLocaleString()} Stars</span>
              </span>
              <span>
                <Icon name="Fork" />
                <span>{githubInfo.forks_count.toLocaleString()} Forks</span>
              </span>
            </div>
          )}
        </a>
        <a href="https://github.com/bchiang7/v4">
          <div>Forked van Brittany Chiang</div>
        </a>
      </StyledCredit>
    </StyledFooter>
  );
};
export default Footer;
