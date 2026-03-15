import React, {useEffect, useRef, useState} from 'react';
import {graphql, useStaticQuery} from 'gatsby';
import {CSSTransition} from 'react-transition-group';
import styled from 'styled-components';
import {srConfig} from '../../config';
import {KEY_CODES} from '../../utils';
import sr from '../../utils/sr';
import {usePrefersReducedMotion} from '../../hooks';

const StyledExperienceSection = styled.section`
  max-width: 700px;

  & + & {
    margin-top: 100px;
  }

  .section-intro {
    max-width: 560px;
    margin: 0 0 30px;
    color: var(--light-slate);
  }

  .inner {
    display: flex;

    @media (max-width: 600px) {
      display: block;
    }

    // Prevent container from jumping
    @media (min-width: 700px) {
      min-height: 340px;
    }
  }
`;

type ExperienceType = 'study' | 'work';

interface ExperienceFrontmatter {
  title?: string | null;
  company?: string | null;
  range?: string | null;
  url?: string | null;
  experienceType?: ExperienceType | null;
  tech?: Array<string | null> | null;
  topics?: Array<string | null> | null;
}

interface ExperienceNode {
  frontmatter?: ExperienceFrontmatter | null;
  html?: string | null;
}

interface ExperienceEdge {
  node: ExperienceNode;
}

interface ExperienceQueryResult {
  jobs: {
    edges: ExperienceEdge[];
  };
}

interface ExperienceTabsProps {
  sectionId: string;
  heading: string;
  intro: string;
  ariaLabel: string;
  items: ExperienceEdge[];
}

const isNonEmptyString = (value: string | null | undefined): value is string => Boolean(value);

const StyledTabList = styled.div`
  position: relative;
  z-index: 3;
  width: max-content;
  padding: 0;
  margin: 0;
  list-style: none;

  @media (max-width: 600px) {
    display: flex;
    overflow-x: auto;
    width: calc(100% + 100px);
    padding-left: 50px;
    margin-left: -50px;
    margin-bottom: 30px;
  }
  @media (max-width: 480px) {
    width: calc(100% + 50px);
    padding-left: 25px;
    margin-left: -25px;
  }

  li {
    &:first-of-type {
      @media (max-width: 600px) {
        margin-left: 50px;
      }
      @media (max-width: 480px) {
        margin-left: 25px;
      }
    }
    &:last-of-type {
      @media (max-width: 600px) {
        padding-right: 50px;
      }
      @media (max-width: 480px) {
        padding-right: 25px;
      }
    }
  }
`;

interface StyledTabButtonProps {
  isActive: boolean
}

const StyledTabButton = styled.button<StyledTabButtonProps>`
  ${({theme}) => theme.mixins.link};
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--tab-height);
  padding: 0 20px 2px;
  border-left: 2px solid var(--oxford-blue-lightest);
  background-color: transparent;
  color: ${({isActive}) => (isActive ? 'var(--radical-red)' : 'var(--slate)')};
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  text-align: left;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0 15px 2px;
  }
  @media (max-width: 600px) {
    ${({theme}) => theme.mixins.flexCenter};
    min-width: 120px;
    padding: 0 15px;
    border-left: 0;
    border-bottom: 2px solid var(--oxford-blue-lightest);
    text-align: center;
  }

  &:hover,
  &:focus {
    background-color: var(--oxford-blue-light);
  }
`;

interface StyledHighlightProps {
  activeTabId: number
}

const StyledHighlight = styled.div<StyledHighlightProps>`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 2px;
  height: var(--tab-height);
  border-radius: var(--border-radius);
  background: var(--radical-red);
  transform: translateY(calc(${({activeTabId}) => activeTabId} * var(--tab-height)));
  transition: transform 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition-delay: 0.1s;

  @media (max-width: 600px) {
    top: auto;
    bottom: 0;
    width: 100%;
    max-width: var(--tab-width);
    height: 2px;
    margin-left: 50px;
    transform: translateX(calc(${({activeTabId}) => activeTabId} * var(--tab-width)));
  }
  @media (max-width: 480px) {
    margin-left: 25px;
  }
`;

const StyledTabPanels = styled.div`
  position: relative;
  width: 100%;
  margin-left: 20px;

  @media (max-width: 600px) {
    margin-left: 0;
  }
`;

const StyledTabPanel = styled.div`
  width: 100%;
  height: auto;
  padding: 10px 5px;

  ul {
    ${({theme}) => theme.mixins.fancyList};
  }

  h3 {
    margin-bottom: 2px;
    font-size: var(--fz-xxl);
    font-weight: 500;
    line-height: 1.3;

    .company {
      color: var(--radical-red);
    }
  }

  .experience-header {
    margin-bottom: 25px;
  }

  .range {
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  .experience-meta {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 16px;
  }

  .meta-group {
    display: flex;
    align-items: flex-start;
    gap: 14px;

    @media (max-width: 600px) {
      flex-direction: column;
      gap: 4px;
    }
  }

  .meta-label {
    min-width: 56px;
    color: var(--lightest-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.08em;
    text-transform: uppercase;

    @media (max-width: 600px) {
      min-width: 0;
    }
  }

  .meta-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 15px;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .meta-list li {
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    line-height: 1.6;
    overflow-wrap: anywhere;
  }

  .gatsby-resp-image-wrapper {
    ${({theme}) => theme.mixins.boxShadow};
    margin-top: 30px !important;
    border-radius: var(--border-radius);
    overflow: hidden;
  }

  img {
    border-radius: var(--border-radius);
  }
`;

const ExperienceTabs = ({sectionId, heading, intro, ariaLabel, items}: ExperienceTabsProps) => {
  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState<number>(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRefs = useRef(items.map(() => React.createRef<HTMLDivElement>()));
  const revealContainer = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr?.reveal(revealContainer.current!, srConfig());
  }, [prefersReducedMotion]);

  const focusTab = () => {
    if (tabs.current[tabFocus]) {
      tabs.current[tabFocus]?.focus();
      return;
    }
    // If we're at the end, go to the start
    if (tabFocus >= tabs.current.length) {
      setTabFocus(0);
    }
    // If we're at the start, move to the end
    if (tabFocus < 0) {
      setTabFocus(tabs.current.length - 1);
    }
  };

  // Only re-run the effect if tabFocus changes
  useEffect(() => focusTab(), [tabFocus]);

  // Focus on tabs when using up & down arrow keys
  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case KEY_CODES.ARROW_UP: {
        e.preventDefault();
        setTabFocus(tabFocus - 1);
        break;
      }

      case KEY_CODES.ARROW_DOWN: {
        e.preventDefault();
        setTabFocus(tabFocus + 1);
        break;
      }

      default: {
        break;
      }
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <StyledExperienceSection id={sectionId} ref={revealContainer}>
      <h2 className="numbered-heading">{heading}</h2>
      <p className="section-intro">{intro}</p>

      <div className="inner">
        <StyledTabList role="tablist" aria-label={ariaLabel} onKeyDown={(e) => onKeyDown(e)}>
          {items.map(({node}, i) => {
            const company = node.frontmatter?.company ?? `Ervaring ${i + 1}`;
            const itemId = `${sectionId}-${company}-${i}`;

            return (
              <StyledTabButton
                key={itemId}
                isActive={activeTabId === i}
                onClick={() => setActiveTabId(i)}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`${sectionId}-tab-${i}`}
                role="tab"
                tabIndex={activeTabId === i ? 0 : -1}
                aria-selected={activeTabId === i}
                aria-controls={`${sectionId}-panel-${i}`}>
                <span>{company}</span>
              </StyledTabButton>
            );
          })}
          <StyledHighlight activeTabId={activeTabId} />
        </StyledTabList>

        <StyledTabPanels>
          {items.map(({node}, i) => {
            const {frontmatter, html} = node;
            const {title, url, company, range, tech, topics} = frontmatter ?? {};
            const metaGroups = [
              {label: 'Tech', items: tech?.filter(isNonEmptyString) ?? []},
              {label: 'Topics', items: topics?.filter(isNonEmptyString) ?? []},
            ].filter(({items}) => items.length > 0);
            const panelRef = panelRefs.current[i];
            const itemId = `${sectionId}-${company}-${i}`;

            return (
              <CSSTransition
                key={itemId}
                nodeRef={panelRef}
                in={activeTabId === i}
                timeout={250}
                classNames="fade">
                <StyledTabPanel
                  ref={panelRef}
                  id={`${sectionId}-panel-${i}`}
                  role="tabpanel"
                  tabIndex={activeTabId === i ? 0 : -1}
                  aria-labelledby={`${sectionId}-tab-${i}`}
                  aria-hidden={activeTabId !== i}
                  hidden={activeTabId !== i}>
                  <h3>
                    <span>{title}</span>
                    <span className="company">
                      &nbsp;@&nbsp;
                      <a href={url!} className="inline-link">
                        {company}
                      </a>
                    </span>
                  </h3>

                  <div className="experience-header">
                    <p className="range">{range}</p>

                    {metaGroups.length > 0 && (
                      <div className="experience-meta">
                        {metaGroups.map(({label, items}) => (
                          <div className="meta-group" key={`${itemId}-${label}`}>
                            <span className="meta-label">{label}</span>
                            <ul className="meta-list">
                              {items.map((item) => (
                                <li key={`${itemId}-${label}-${item}`}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div dangerouslySetInnerHTML={{__html: html!}} />
                </StyledTabPanel>
              </CSSTransition>
            );
          })}
        </StyledTabPanels>
      </div>
    </StyledExperienceSection>
  );
};

const Jobs = () => {
  const data = useStaticQuery(graphql`
    query AllJobs {
      jobs: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/jobs/" } }
        sort: { frontmatter: { date: DESC } }
      ) {
        edges {
          node {
            frontmatter {
              title
              company
              range
              url
              experienceType
              tech
              topics
            }
            html
          }
        }
      }
    }
  `) as ExperienceQueryResult;

  const jobsData = data.jobs.edges;
  const workExperience = jobsData.filter(
      ({node}) => node.frontmatter?.experienceType === 'work',
  );
  const studyExperience = jobsData.filter(
      ({node}) => node.frontmatter?.experienceType === 'study',
  );

  return (
    <>
      <ExperienceTabs
        sectionId="jobs"
        heading="Werkervaring"
        intro="Professionele ervaring uit rollen in loondienst."
        ariaLabel="Tabs met werkervaring"
        items={workExperience}
      />
      <ExperienceTabs
        sectionId="study-experience"
        heading="Studie, stages en projecten"
        intro="Stages, afstudeerwerk en projecten uit mijn studietijd."
        ariaLabel="Tabs met studie-ervaring"
        items={studyExperience}
      />
    </>
  );
};

export default Jobs;
