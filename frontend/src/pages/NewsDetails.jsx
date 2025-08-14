import { useParams, Link, useNavigate } from 'react-router-dom';
import NewsDetailsMetaTags from '../pages/NewsDetailsMetaTags';
import { useEffect, useState } from 'react';
import NewsSidebar from './NewsSidebar';
import Breadcrumb from './Breadcrumb';
import { FaXTwitter } from 'react-icons/fa6';
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  WhatsappIcon,
  LinkedinIcon,
} from 'react-share';
import { useLoading } from '../context/LoadingContext'; 

function NewsDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setIsAppLoading } = useLoading(); 

  const currentUrl = `${window.location.origin}/news/${slug}`;

  useEffect(() => {
    let isMounted = true;
    setArticle(null);
    setLoading(true);
    setIsAppLoading(true); 

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        const data = await res.json();

        if (!res.ok || !data) {
          navigate('/404');
          return;
        }

        if (isMounted) {
          setArticle(data);
        }
      } catch (err) {
        if (isMounted) {
          navigate('/404');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsAppLoading(false); 
        }
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [slug, navigate, setIsAppLoading]);

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading article...</div>;
  }

  if (!article) {
    return <div className="p-10 text-center text-gray-500">No article found.</div>;
  }

  return (
    <>
      <NewsDetailsMetaTags article={article} url={currentUrl} />

      <div className="h-auto container mx-auto flex max-md:flex-col px-4 gap-6 py-10">
        <div className="w-[70%] max-md:w-full bg-white rounded-lg overflow-hidden p-4">

          <Breadcrumb articleTitle={article.title} category={article.category} />

          <Link to={`/category/${article?.category?.name || 'Unavailable'}`}>
            <span className="text-xs font-bold bg-[#fa5005] text-white px-2 py-1 rounded">
              {article?.category?.name || 'No Category'}
            </span>
          </Link>

          <h1 className="text-2xl font-bold mt-4 leading-snug">{article.title}</h1>

          <p className="text-sm text-gray-500 mt-1">
            {article?.author?.username || 'Admin'} /{' '}
            {new Date(article.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>

          <div className="flex gap-3 mt-4 mb-4">
            <FacebookShareButton url={currentUrl}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <WhatsappShareButton url={currentUrl}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <TwitterShareButton url={currentUrl}>
              <div className="bg-black text-white p-2 rounded-full w-[32px] h-[32px] flex items-center justify-center">
                <FaXTwitter size={20} />
              </div>
            </TwitterShareButton>
            <LinkedinShareButton url={currentUrl}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
          </div>

          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt={article.metaTitle || article.title}
              loading="lazy"
              className="w-full my-6 rounded"
            />
          )}

          <div
            className="text-gray-700 leading-relaxed text-base prose max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          ></div>
        </div>

        <div className="w-[30%] max-md:w-full">
          <NewsSidebar />
        </div>
      </div>
    </>
  );
}

export default NewsDetails;
