import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../pageStyles/Products.css';
import PageTitle from '../components/PageTitle';
import { getProduct, removeErrors } from '../features/products/productSlice';
import { useSelector, useDispatch } from 'react-redux';
import Product from '../components/Product';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import NoProduct from '../components/NoProduct';
import Pagination from '../components/Pagination';

function Products() {
  const {
    products = [],
    loading,
    error,
    resultPerPage,
    productCount,
    totalPages,
  } = useSelector((state) => state.product);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  

  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const pageFromURL = parseInt(searchParams.get('page'), 10) || 1;

  const [currentPage, setCurrentPage] = useState(pageFromURL);
  const catagories = [
    'Electronics',
    'Books',
    'Men’s Clothing',
    'Women’s Clothing',
    'Footwear',
    'Accessories',
    'Home Appliances',
  ]; 

  // 🧠 Keep state in sync with URL when navigating via back/forward buttons
  useEffect(() => {
    const pageInURL = parseInt(new URLSearchParams(location.search).get('page'), 10) || 1;
    if (pageInURL !== currentPage) {
      setCurrentPage(pageInURL);
    }
  }, [location.search]);

  // 🚀 Fetch products when keyword or page changes
  useEffect(() => {
    dispatch(getProduct({ keyword, page: currentPage, category }));
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
  }, [dispatch, keyword, currentPage, category]);

  // ⚠️ Show error toast if needed
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  // 🔄 Handle page change + URL sync
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);

      const newSearchParams = new URLSearchParams(location.search);
      if (page === 1) {
        newSearchParams.delete('page');
      } else {
        newSearchParams.set('page', page);
      }
      navigate(`?${newSearchParams.toString()}`);
    }
  };

  // 🔄 Handle category change + URL sync
  const handleCategoryChange = (category) => {
    const newSearchParams = new URLSearchParams(location.search);
    if (category === 'All') {
      newSearchParams.delete('category');
    } else {
      newSearchParams.set('category', category);
    }
    navigate(`?${newSearchParams.toString()}`);
  };

  if (loading) return <Loader />;

  return (
    <>
      <PageTitle title="All Products" />
      <div className="products-layout">
        <div className="filter-section">
          <h3 className="filter-heading">Categories</h3>
          {/* Render category filters here */}
          <ul>
            {catagories.map((category) => (
              <li 
                key={category}
                onClick={() => {handleCategoryChange(category)}
                   }
                >
              
                  
                  
                
                  {category}
                
              </li>
            ))}
          </ul>
          
          

        </div>

        <div className="products-section">
          {products.length > 0 ? (
            <div className="products-product-container">
              {products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <NoProduct keyword={keyword} />
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={totalPages} // Pass totalPages prop to Pagination
          />
        </div>
      </div>
    </>
  );
}

export default Products;
