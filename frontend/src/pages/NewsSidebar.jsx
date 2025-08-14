import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { FaXTwitter, FaInstagram } from 'react-icons/fa6';

function NewsSidebar({ onSearch }) {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts/all-posts');
        const data = await res.json();

        if (data.length > 5) {
          const shuffled = data.sort(() => 0.5 - Math.random());
          setPosts(shuffled.slice(0, 5));
        } else {
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    const inputValue = e.target.value;
    const wordCount = inputValue.trim().split(/\s+/).length;

    if (wordCount <= 12) {
      setSearchText(inputValue);
      if (onSearch) onSearch(inputValue);
    }
  };
  ;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchText.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(searchText.trim())}`);
    }
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options).toUpperCase();
  };

  return (
    <div className="flex-1 my-5 flex flex-col sticky top-11 h-fit z-10 bg-white">
      <div className="px-4 pt-6 bg-white rounded-md w-full max-w-xl mx-auto">
        <h3 className="text-base font-bold mb-3">Explore</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 rounded-md py-2 pr-10 pl-3 focus:outline-none"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="flex-1 p-4 bg-white">
        <h3 className="text-base font-bold mb-3">Discover More</h3>
        {posts.length === 0 ? (
          <p className="text-base text-gray-600">No posts available at the moment.</p>
        ) : (
          <div className="flex flex-col justify-between h-full">
            {posts.map((post) => (
              <div
                key={post._id}
                onClick={() => {
                  window.scrollTo({ top: 0 });
                  navigate(`/news/${post.slug}`);
                }}
                className="flex flex-row items-start gap-3 bg-white cursor-pointer px-2 py-1"
              >
                <div className="w-20 h-14 sm:w-24 sm:h-16 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}${post.imageUrl}`}
                    alt="Post thumbnail"
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/96x64/CCCCCC/000000?text=Error';
                    }}
                  />
                </div>

                <div className="flex-grow text-left">
                  <h3
                    className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-800 leading-snug"
                    style={{
                      whiteSpace: "normal",
                      overflow: "visible",
                      textOverflow: "unset",
                    }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(post.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      <div className="px-4 bg-white max-lg:mt-4">
        <h3 className="text-base font-bold mb-3 flex items-center">Stay Connected</h3>
        <div className="grid grid-cols-2 gap-3">
          <a href="https://x.com/itstechstart" target="_blank" rel="noopener noreferrer">
            <div className="flex items-center cursor-pointer bg-[#1da1f2] text-white px-3 py-3 rounded">
              <FaXTwitter className="mr-2" />
              <div>
                <div className="text-xs">Twitter</div>
              </div>
            </div>
          </a>
          <a href="https://www.instagram.com/startwithtech/" target="_blank" rel="noopener noreferrer">
            <div className="flex items-center cursor-pointer bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-3 rounded">
              <FaInstagram className="mr-2" />
              <div>
                <div className="text-xs">Instagram</div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default NewsSidebar;
