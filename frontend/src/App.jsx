import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// import components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// import pages
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Products from './pages/Products'

function App() {
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
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
