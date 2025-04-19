import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from 'react-redux';
import '../componentStyles/Navbar.css'
import '../pageStyles/Search.css'
import { Close } from '@mui/icons-material';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const {isAuthenticated} = useSelector((state) => state.user)
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }
    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    }
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
            // setSearchQuery('');
            // setIsSearchOpen(false);
        } else {
            navigate('/products');
            
        }
        setSearchQuery('');
        
    };




  return (
    <nav className="navbar">
        <div className="navbar-container">
            <div className="navbar-logo">
                <Link to="/" onClick={()=>setIsMenuOpen(false) }   >ShopEasy</Link>
            </div>
            <div className={`navbar-links ${isMenuOpen? 'active' : ''}`} >
                <ul>
                    <li onClick={()=>setIsMenuOpen(false) }><Link to="/">Home</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/contact">Contact Us</Link></li>
                    
                </ul>              
            </div>
            <div className="navbar-icons">
                <div className="search-container">
                    <form
                        onSubmit={handleSearchSubmit}
                        className={`search-form ${isSearchOpen? 'active' : ''}`} >
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className='search-input'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        <button type="button" className='search-icon' onClick={toggleSearch}>
                            <SearchIcon focusable='false'  /> 
                        </button>
                    </form>
                </div>
                <div className="cart-container">
                    <Link to="/cart" >
                        <ShoppingCartIcon className='icon' />
                        <span className="cart-badge">6</span>
                    </Link>
                </div>
               {!isAuthenticated && <Link to='/login' className='register-link' >
                     <PersonAddIcon className='icon' />
                </Link>}
                <div className="navbar-hamburger" onClick={toggleMenu}>  
                    {isMenuOpen ? <Close className='icon' /> : <MenuIcon className='icon' />}

                </div>
            </div>
        </div>
      
    </nav>
  )
}

export default Navbar
