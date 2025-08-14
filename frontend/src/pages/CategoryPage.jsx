import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';
import NewsSidebar from './NewsSidebar';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const { setIsAppLoading } = useLoading();

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fallbackTimeout, setFallbackTimeout] = useState(null);
  const postsPerPage = 6;

  useEffect(() => {
    setIsAppLoading(true);

    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts/all-posts');
        const data = await res.json();

        if (Array.isArray(data)) {
          setPosts(data);

          const filtered = data.filter(
            (post) =>
              post.category?.name?.toLowerCase() === category?.toLowerCase()
          );
          setFilteredPosts(filtered);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
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
  }, [category, setIsAppLoading]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedData = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setTimeout(() => {
        if (scrollRef.current) {
          const topOffset = scrollRef.current.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: topOffset - 65,
            behavior: 'smooth',
          });
        }
      }, 50);
    }
  };

  return (
    <div className="h-auto container mx-auto flex max-md:flex-col px-4 py-10 gap-6 font-poppins">
      <div className="w-[70%] max-md:w-full" ref={scrollRef}>
        <h2 className="font-bold text-xl mb-6">
          <span className="border-l-4 border-[#fa5005] pl-3 text-black uppercase tracking-wide">
            Exploring: {category.toUpperCase()}
          </span>
        </h2>

        {paginatedData.length === 0 ? (
          <p className="text-gray-500 text-base">No posts available in this category.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedData.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  window.scrollTo({ top: 0 });
                  navigate(`/news/${item.slug}`);
                }}
                className="bg-white rounded-lg overflow-hidden cursor-pointer flex flex-col"
              >
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}${item.imageUrl}`}
                  alt="news"
                  loading="lazy"
                  className="h-72 w-full object-cover"
                />
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <span className="text-xs font-bold text-[#fa5005] uppercase mb-2">
                    {item.category?.name || 'Unavaliable'}
                  </span>
                  <h2 className="text-lg font-bold leading-snug hover:text-[#fa5005] transition-colors duration-300">
                    {item.title}
                  </h2>
                  <p className="text-xs text-gray-500 mt-3">
                    By {item.author?.username || 'Admin'} —{' '}
                    {new Date(item.createdAt).toLocaleDateString()} &nbsp;
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredPosts.length > postsPerPage && (
          <div className="col-span-full flex justify-center mt-8 gap-4">
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
      </div>

      <div className="w-[30%] max-md:w-full">
        <NewsSidebar />
      </div>
    </div>
  );
}

export default CategoryPage;
