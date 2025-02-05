import React from 'react';
import {Helmet} from 'react-helmet';
import {useLocation} from '@reach/router';
import {graphql, useStaticQuery} from 'gatsby';
import {SiteQuery} from '../../graphql-types';

// https://www.gatsbyjs.com/docs/add-seo-component/

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
}

const Head = ({title, description, image}: HeadProps) => {
  const {pathname} = useLocation();

  const {site} = useStaticQuery<SiteQuery>(
      graphql`
      query Site{
        site {
          siteMetadata {
            defaultTitle: title
            defaultDescription: description
            siteUrl
            defaultImage: image
          }
        }
      }
    `,
  );

  const {defaultTitle, defaultDescription, siteUrl, defaultImage} = site!.siteMetadata!;

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${pathname}`,
  };

  return (
    <Helmet title={title} defaultTitle={seo.title!} titleTemplate={`%s | ${defaultTitle}`}>
      <html lang="en" />

      <meta name="description" content={seo.description!} />
      <meta name="image" content={seo.image} />

      <meta property="og:title" content={seo.title!} />
      <meta property="og:description" content={seo.description!} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content="website" />

      <meta name="google-site-verification" content="tagqXribcJ762w1pjRWqndS93DRjkg-FpaG8-_JaZ70" />
    </Helmet>
  );
};

export default Head;
