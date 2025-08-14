import React, { useEffect, useState } from 'react';
import News from './News';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useLoading } from '../context/LoadingContext'; 

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [randomPost, setRandomPost] = useState(null);
  const { setIsAppLoading } = useLoading(); 
  const [fallbackTimeout, setFallbackTimeout] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const msg = params.get('msg');

    if (msg === 'verified') toast.success('Subscription verified!');
    else if (msg === 'expired') toast.error('Link expired. Try again.');
    else if (msg === 'invalid') toast.error('Invalid verification link.');
    else if (msg === 'error') toast.error('Something went wrong.');

    if (msg) {
      setTimeout(() => {
        params.delete('msg');
        navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
      }, 50);
    }
  }, [location, navigate]);

  useEffect(() => {
    setIsAppLoading(true); 
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts/all-posts');
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to fetch posts');
        setPosts(data);

        if (data.length >= 5) {
          const latestFive = data.slice(0, 5);
          const randomOne = latestFive[Math.floor(Math.random() * latestFive.length)];
          setRandomPost(randomOne);
        } else if (data.length > 0) {
          setRandomPost(data[Math.floor(Math.random() * data.length)]);
        }
      } catch (err) {
        toast.error(err.message || 'Something went wrong while loading posts');
      } finally {
        clearTimeout(fallbackTimeout);
        setIsAppLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      setIsAppLoading(false);
    }, 6000);

    setFallbackTimeout(timeout);

    fetchPosts();

    return () => clearTimeout(timeout);
  }, [setIsAppLoading]);

  return (
    <>
      <ToastContainer position="top-right" />

      {posts.length === 0 ? (
        <div className="h-[calc(100vh-10rem)] flex flex-col items-center justify-center text-gray-600">
          <p className="text-base text-gray-600">No posts available at the moment.</p>
        </div>
      ) : randomPost ? (
        <div
          className="w-full h-[79vh] max-md:h-[40vh] relative overflow-hidden"
          onClick={() => {
            window.scrollTo({ top: 0 });
            navigate(`/news/${randomPost.slug}`);
          }}
        >
          <div className="absolute inset-0 filter blur-xl scale-110 z-[1]">
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}${randomPost.imageUrl}`}
              alt="Background blurred"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="absolute inset-0 z-[2]">
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}${randomPost.imageUrl}`}
              alt="Foreground"
              className="w-full h-full object-contain object-center"
              loading="lazy"
            />
          </div>

          <div className="absolute bottom-0 left-0 w-full px-4 py-4 sm:px-6 sm:py-6 bg-gradient-to-t from-black/80 to-transparent z-10">
            <p className="text-sm sm:text-base text-white/80 mb-1">
              {new Date(randomPost.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>

            <h1 className="text-lg sm:text-2xl font-semibold leading-tight text-white mb-1 line-clamp-2">
              {randomPost.title}
            </h1>

            <p className="text-sm sm:text-base text-white/70 line-clamp-2 sm:line-clamp-3 max-w-[90%]">
              {(() => {
                const text = randomPost.content?.replace(/<[^>]+>/g, '') || '';
                const words = text.split(' ');
                return words.length > 12 ? words.slice(0, 12).join(' ') + '...' : text;
              })()}
            </p>
          </div>
        </div>
      ) : null}

      <News />
    </>
  );
}

export default Home;
