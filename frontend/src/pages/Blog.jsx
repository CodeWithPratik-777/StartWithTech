import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';

function Blog() {
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    const [posts, setPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState(['All']);
    const { setIsAppLoading } = useLoading();
    const [fallbackTimeout, setFallbackTimeout] = useState(null);

    const postsPerPage = 9;

    useEffect(() => {
        setIsAppLoading(true);

        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/posts/all-posts');
                const data = await res.json();

                if (!res.ok) throw new Error(data.message || 'Failed to fetch posts');
                setPosts(data);

                const extractedCategories = Array.from(
                    new Set(data.map((post) => post.category?.name).filter(Boolean))
                );
                setCategories(['All', ...extractedCategories]);
            } catch (error) {
                console.error('Error fetching posts:', error);
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

    const filteredPosts =
        selectedCategory === 'All'
            ? posts
            : posts.filter((post) => post.category?.name === selectedCategory);

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

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
        <div className="container mx-auto px-4 py-8 font-poppins">
            <div className="flex justify-between items-center !mb-8">
                <h2 className="font-bold text-xl">
                    <span className="border-l-4 border-[#fa5005] pl-3 text-black uppercase tracking-wide">
                        Blogs
                    </span>
                </h2>
                <select
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-gray-300 text-sm px-4 py-2 pr-8 rounded-md shadow-sm focus:outline-none"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" ref={scrollRef}>
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
                                    ? item.content
                                          .replace(/<[^>]+>/g, '')
                                          .split(' ')
                                          .slice(0, 15)
                                          .join(' ') + '...'
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

            {paginatedPosts.length === 0 && (
                <p className="text-center text-base text-gray-600 mt-6">No posts available at the moment.</p>
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
    );
}

export default Blog;
