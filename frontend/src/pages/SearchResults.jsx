import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useLoading } from '../context/LoadingContext';
import NewsSidebar from './NewsSidebar';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const query = searchParams.get('query');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { setIsAppLoading } = useLoading();

  const postsPerPage = 6;

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setIsAppLoading(true);

    fetch(`/api/posts/search?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setCurrentPage(1);
      })
      .catch((err) => {
        console.error('Error fetching search results:', err);
      })
      .finally(() => {
        setLoading(false);
        setIsAppLoading(false);
      });
  }, [query, setIsAppLoading]);

  const totalPages = Math.ceil(results.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = results.slice(startIndex, startIndex + postsPerPage);

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
    <div className="container mx-auto px-4 py-10 font-poppins">
      <div className="flex max-md:flex-col gap-6">
        <div className="w-[70%] max-md:w-full">
          <div className="mb-8">
            <h2 className="font-bold text-xl">
              <span className="border-l-4 border-[#fa5005] pl-3 text-black uppercase tracking-wide">
                Search Results for: "{query}"
              </span>
            </h2>
          </div>

          {loading ? (
            <p className="text-center text-gray-600 text-base">Loading...</p>
          ) : paginatedPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" ref={scrollRef}>
                {paginatedPosts.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => {
                      window.scrollTo({ top: 0 });
                      navigate(`/news/${item.slug}`);
                    }}
                  >
                    <div className="p-4">
                      <Link
                        to={`/category/${item.category?.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.scrollTo({ top: 0 });
                        }}
                      >
                        <span className="text-xs font-bold bg-[#fa5005] text-white px-2 py-1 rounded">
                          {item.category?.name || 'Unavailable'}
                        </span>
                      </Link>
                      <h2 className="text-lg font-bold mt-2 leading-snug hover:text-[#fa5005] transition-colors duration-300">
                        {item.title}
                      </h2>
                    </div>
                    <img
                      src={`${process.env.REACT_APP_BACKEND_URL}${item.imageUrl}`}
                      alt="blog"
                      loading="lazy"
                      className="h-64 w-full object-cover"
                    />
                    <div className="p-4">
                      <div className="text-sm text-gray-600 line-clamp-4 overflow-hidden">
                        {item.content
                          ? item.content.replace(/<[^>]+>/g, '').split(' ').slice(0, 15).join(' ') + '...'
                          : ''}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {item?.author?.username ?? 'Admin'} /{' '}
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {results.length > postsPerPage && (
                <div className="flex justify-center mt-10 gap-4">
                  {currentPage > 1 && (
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      className="px-4 py-2 rounded border text-sm hover:bg-[#fa5005] hover:text-white transition flex items-center gap-2"
                    >
                      <FaArrowLeft />
                      Prev
                    </button>
                  )}
                  {currentPage < totalPages && (
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      className="px-4 py-2 rounded border text-sm hover:bg-[#fa5005] hover:text-white transition flex items-center gap-2"
                    >
                      Next
                      <FaArrowRight />
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-base text-gray-600 mt-6 flex justify-center items-center h-full">
              No results found.
            </p>
          )}
        </div>

        <div className="w-[30%] max-md:w-full">
          <NewsSidebar />
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
