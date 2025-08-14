import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function DefaultMetaTags() {
  const location = useLocation();
  
  useEffect(() => {
    if (!location.pathname.startsWith('/news/')) {
      const resetMetaTags = () => {
        document.title = 'StartWithTech — Insights on Technology, Design & Business';
        
        const defaultMeta = {
          'description': 'StartWithTech is a modern tech blog delivering fresh insights, tutorials, and updates on technology, design, startups, and digital innovation.',
          'keywords': 'tech blog, technology news, design insights, startup trends, business tips, software tutorials, web development, AI, digital tools',
          'og:title': 'StartWithTech — Insights on Technology, Design & Business',
          'og:description': 'StartWithTech is a modern tech blog delivering fresh insights, tutorials, and updates on technology, design, startups, and digital innovation.',
          'og:type': 'website',
          'og:url': window.location.href,
          'twitter:title': 'StartWithTech — Insights on Technology, Design & Business',
          'twitter:description': 'StartWithTech is a modern tech blog delivering fresh insights, tutorials, and updates on technology, design, startups, and digital innovation.'
        };

        Object.entries(defaultMeta).forEach(([name, content]) => {
          const isOgTag = name.startsWith('og:');
          const selector = isOgTag 
            ? `meta[property="${name}"]` 
            : `meta[name="${name}"]`;
          
          let element = document.querySelector(selector);
          if (!element) {
            element = document.createElement('meta');
            if (isOgTag) {
              element.setAttribute('property', name);
            } else {
              element.setAttribute('name', name);
            }
            document.head.appendChild(element);
          }
          element.setAttribute('content', content);
        });

        ['og:image', 'twitter:image'].forEach(tag => {
          const element = document.querySelector(`meta[property="${tag}"], meta[name="${tag}"]`);
          if (element) {
            element.remove();
          }
        });
      };

      resetMetaTags();
    }
  }, [location.pathname]);

  if (location.pathname.startsWith('/news/')) {
    return null;
  }

  return (
    <Helmet>
      <title>StartWithTech — Insights on Technology, Design & Business</title>
      <meta
        name="description"
        content="StartWithTech is a modern tech blog delivering fresh insights, tutorials, and updates on technology, design, startups, and digital innovation."
      />
      <meta
        name="keywords"
        content="tech blog, technology news, design insights, startup trends, business tips, software tutorials, web development, AI, digital tools"
      />
      <meta property="og:title" content="StartWithTech — Insights on Technology, Design & Business" />
      <meta property="og:description" content="StartWithTech is a modern tech blog delivering fresh insights, tutorials, and updates on technology, design, startups, and digital innovation." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta name="twitter:title" content="StartWithTech — Insights on Technology, Design & Business" />
      <meta name="twitter:description" content="StartWithTech is a modern tech blog delivering fresh insights, tutorials, and updates on technology, design, startups, and digital innovation." />
    </Helmet>
  );
}

export default DefaultMetaTags;