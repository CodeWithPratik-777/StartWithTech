import React, { useState, useEffect, useRef } from 'react';
import NewsSidebar from './NewsSidebar';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function News() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const postsPerPage = 6;
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts/all-posts');
        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.content?.toLowerCase().includes(q) ||
          post.category?.name?.toLowerCase().includes(q)
      );
      setFilteredPosts(filtered);
      setCurrentPage(1);
    }
  }, [searchQuery, posts]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedData = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setTimeout(() => {
        if (scrollRef.current) {
          const topOffset = scrollRef.current.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: topOffset - 65, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 h-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        <div
          className="w-full lg:w-[70%] p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 my-5"
          ref={scrollRef}
        >
          {paginatedData.length > 0 ? (
            paginatedData.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  window.scrollTo({ top: 0 });
                  navigate(`/news/${item.slug}`);
                }}
                className="cursor-pointer flex flex-col max-sm:mb-2"
              >
                <div className="px-2">
                  <Link
                    to={`/category/${item.category?.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.scrollTo({ top: 0 });
                    }}
                  >
                    <span className="text-xs font-bold bg-[#fa5005] text-white px-2 py-1 rounded">
                      {item.category?.name?.toUpperCase() || 'Unavailable'}
                    </span>
                  </Link>
                  <h2 className="text-lg font-bold mt-3 leading-snug hover:text-[#fa5005] transition-colors duration-300">
                    {item.title}
                  </h2>
                </div>

                <div className="my-3">
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}${item.imageUrl}`}
                    alt="news"
                    loading="lazy"
                    className="w-full object-contain my-5"
                  />
                </div>

                <div className="px-2 flex flex-col justify-between pb-1">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.content
                      ?.replace(/<[^>]+>/g, '')
                      .split(' ')
                      .slice(0, 25)
                      .join(' ') + '...'}
                  </p>
                  <p className="text-xs text-gray-500 mt-3">
                    {item.author?.username || 'Admin'} /{' '}
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-base m-auto text-gray-600">
              No posts found.
            </p>
          )}

          {filteredPosts.length > postsPerPage && (
            <div className="col-span-full flex justify-center mt-8 gap-4">
              {currentPage > 1 && (
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  className="h-10 px-4 py-2 rounded border text-sm hover:bg-[#fa5005] hover:text-white transition flex items-center gap-2"
                >
                  <FaArrowLeft />
                  Prev
                </button>
              )}

              {currentPage < totalPages && (
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  className="h-10 px-4 py-2 rounded border text-sm hover:bg-[#fa5005] hover:text-white transition flex items-center gap-2"
                >
                  Next
                  <FaArrowRight />
                </button>
              )}
            </div>
          )}

        </div>

        <div className="w-full lg:w-[30%] flex-shrink-0">
          <NewsSidebar onSearch={setSearchQuery} />
        </div>
      </div>
    </div>
  );
}

export default News;
