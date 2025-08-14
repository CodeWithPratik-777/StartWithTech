import { Helmet } from 'react-helmet-async';
import { useEffect, useMemo } from 'react';

function NewsDetailsMetaTags({ article, url }) {
  const { title, description, keywords, imageUrl } = useMemo(() => ({
    title: `${article.metaTitle || article.title} - StartWithTech`,
    description: article.metaDescription || article.title,
    keywords: article.metaKeywords || '',
    imageUrl: article.imageUrl ? `${article.imageUrl}?v=${Date.now()}` : null
  }), [article]);

  const metaTags = useMemo(() => [
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:site_name', content: 'StartWithTech' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    ...(imageUrl ? [
      { property: 'og:image', content: imageUrl },
      { name: 'twitter:image', content: imageUrl }
    ] : [])
  ], [title, description, keywords, url, imageUrl]);

  useEffect(() => {
    const updateOrCreateMeta = (name, property, content) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }

      if (content !== element.content) {
        element.setAttribute('content', content);
      }
    };

    document.title = title;

    metaTags.forEach(({ name, property, content }) => {
      updateOrCreateMeta(name, property, content);
    });

    try {
      if (window.FB) window.FB.XFBML.parse();
      if (window.twttr) window.twttr.widgets.load();
    } catch (e) {
      console.error('Social platform update error:', e);
    }
  }, [metaTags, title]);

  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: description,
    datePublished: article.createdAt,
    ...(imageUrl && { image: [imageUrl] })
  }), [title, description, article.createdAt, imageUrl]);

  return (
    <Helmet>
      <title>{title}</title>
      {metaTags.map((tag, index) => (
        tag.property ? (
          <meta key={`${tag.property}-${index}`} property={tag.property} content={tag.content} />
        ) : (
          <meta key={`${tag.name}-${index}`} name={tag.name} content={tag.content} />
        )
      ))}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <link rel="preconnect" href="https://platform.twitter.com" />
      <link rel="preconnect" href="https://graph.facebook.com" />
    </Helmet>
  );
}

export default NewsDetailsMetaTags;