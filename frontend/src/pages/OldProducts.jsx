import {useState, useEffect} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import '../pageStyles/Products.css'
import PageTitle from '../components/PageTitle'
import { getProduct } from '../features/products/productSlice'
import { useSelector, useDispatch } from 'react-redux'
import Product from '../components/Product'
import { toast } from 'react-toastify'
import { removeErrors } from '../features/products/productSlice'
import Loader from '../components/Loader'
import NoProduct from '../components/NoProduct'
import Pagination from '../components/Pagination'

function Products() {
    const { products, loading, error, resultPerPage, productCount } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get('keyword') || '';
    const pageFromURL = parseInt(searchParams.get('page'), 10 )|| 1;
    const [currentPage, setCurrentPage] = useState(pageFromURL)
    const navigate = useNavigate()
    
    

    useEffect(() => {
        dispatch(getProduct({keyword, page:currentPage}));
    }, [dispatch, keyword, currentPage]);

        useEffect(() => {
            if (error) {
                toast.error(error)
                dispatch(removeErrors())
            }
        }
        , [dispatch, error])

        const handlePageChange = (page) => {
            if(page !== currentPage) {
                setCurrentPage(page)
                const newSearchParams = new URLSearchParams(location.search);
                if (page === 1) {
                    newSearchParams.delete('page');
                }
                else {
                    newSearchParams.set('page', page);
                }
                navigate(`?${newSearchParams.toString()}`);

            }
            
        }


    if (loading) return <Loader /> 

  return (
    <>
    <PageTitle title="All Products" />
    <div className="products-layout">
        <div className="filter-section">
            <h3 className="filter-heading">Categories</h3>
            {/* render all the catagories here */}
        </div>
        <div className="products-section">

            { products.length > 0? (<div className="products-product-container">

                 {products.map((product) => (
                    <Product key={product._id} product={product} />
                ))} 

            </div>) : (<NoProduct keyword={keyword} />) }
                
                {/* pagination */}
                <Pagination
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    
                />
        </div>
    </div>      
    </>
  )
}

export default Products
