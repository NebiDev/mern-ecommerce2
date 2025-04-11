import React from 'react'
import '../componentStyles/NoProducts.css'

function NoProduct({keyword}) {
  return (
    <div className="no-products-content">
        <div className="no-products-icon">⚠️</div>
            <h3 className="no-products-title"> No Products Found </h3>
            <p className="no-products-message">
                {keyword? `Sorry, we couldn't find any products matching "${keyword}" Please try again with different keywords or check back later.` : 'No products available at the moment. Please check back later.'}
               

            </p>

        
      
    </div>
  )
}

export default NoProduct
