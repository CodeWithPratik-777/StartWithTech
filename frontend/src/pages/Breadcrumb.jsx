import { Link } from 'react-router-dom';
import { HiChevronRight } from 'react-icons/hi'; 

function Breadcrumb({ articleTitle, category }) {
  return (
    <nav className="text-sm mb-6" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center space-x-1 text-gray-600">
        <li>
          <Link to="/" className="hover:text-[#fa5005] transition font-medium">
            Home
          </Link>
        </li>
        <li>
          <HiChevronRight className="text-gray-400" />
        </li>
        <li>
          <Link to="/blog" className="hover:text-[#fa5005] transition font-medium">
            Blog
          </Link>
        </li>
        {category?.name && (
          <>
            <li>
              <HiChevronRight className="text-gray-400" />
            </li>
            <li>
              <Link
                to={`/category/${category.name}`}
                className="hover:text-[#fa5005] transition font-medium capitalize"
              >
                {category.name}
              </Link>
            </li>
          </>
        )}
        <li>
          <HiChevronRight className="text-gray-400" />
        </li>
        <li className="text-gray-800 font-semibold truncate max-w-[220px]">
          {articleTitle}
        </li>
      </ol>
    </nav>
  );
}

export default Breadcrumb;
