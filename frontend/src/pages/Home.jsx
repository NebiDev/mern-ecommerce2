
import { useState, useEffect, use } from 'react'
import '../pageStyles/Home.css'
import Navbar from "../components/Navbar"
import ImageSlider from "../components/ImageSlider"
import Product from "../components/Product"
import Footer from "../components/Footer"
import PageTitle from '../components/PageTitle'
import Loader from '../components/Loader'
import { toast } from 'react-toastify'
import {useSelector, useDispatch } from 'react-redux'
import { getProduct, removeErrors } from '../features/products/productSlice'




const Home = () => {
    const { products, loading, error, productCount } = useSelector((state) => state.product)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getProduct( {keyword: ''}))
    }, [dispatch])

    useEffect(() => {
        if (error) {
            toast.error(error)
            dispatch(removeErrors())
        }
    }
    , [dispatch, error])


    if (loading) return <Loader />;

    return (
      <>
        <PageTitle title="Home" />
        <ImageSlider />
        <div className="home-container">
          <h2 className="home-heading">Trending Now</h2>
          <div className="home-product-container">
            {products?.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </div>
      </>
    );
    
}

export default Home
