import React from 'react';
import {graphql, useStaticQuery} from 'gatsby';

// https://www.gatsbyjs.com/docs/add-seo-component/

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  pathname: string;
}

const Seo = ({title, description, image, pathname}: SeoProps) => {
  const {site} = useStaticQuery<Queries.SiteQuery>(
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

  const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;

  return (
    <>
      <html lang="en" />

      <title>{pageTitle}</title>

      <meta name="description" content={seo.description!} />
      <meta name="image" content={seo.image} />

      <meta property="og:title" content={seo.title!} />
      <meta property="og:description" content={seo.description!} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content="website" />

      <meta name="google-site-verification" content="tagqXribcJ762w1pjRWqndS93DRjkg-FpaG8-_JaZ70" />
    </>
  );
};

export default Seo;
