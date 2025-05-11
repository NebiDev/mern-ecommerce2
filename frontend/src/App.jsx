import {  useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { loadUser } from './features/user/userSlice'
import './App.css'


// import components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// import pages
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Products from './pages/Products'
import Register from './user/Register'
import Login from './user/Login'
import UserDashboard from './user/UserDashboard.jsx'
import Profile from './user/Profile.jsx'
import UpdateProfile from './user/UpdateProfile.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import UpdatePassword from './user/UpdatePassword.jsx';
import ForgotPassword from './user/ForgotPassword.jsx';
import ResetPassword from './user/ResetPassword.jsx';
import Cart from './cart/Cart.jsx'

function App() {
  const {isAuthenticated, user} = useSelector((state) => state.user)
  const dispatch = useDispatch()


  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  

  



  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:keyword" element={<Products />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
            <Route path="/profile/update" element={<ProtectedRoute element={<UpdateProfile />} />} />
            <Route path="/password/update" element={<ProtectedRoute element={<UpdatePassword />} />} />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset/:token" element={<ResetPassword />} />  
            <Route path="/cart" element={<Cart />} />          
          </Routes>
          {isAuthenticated && <UserDashboard user={user} />}
          
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
