import Product from '../models/productModel.js';
import HandleError from '../utils/handleError.js';
import handleAsyncError from '../middleware/handleAsyncError.js';
import APIFunctionality from '../utils/apiFunctionality.js';

// http://localhost:8000/api/v1/product/67f146ef8aa36c55932f1137?keyword=shirt

// Create Products
export const createProducts= handleAsyncError(async(req, res, next) =>{
    req.body.user = req.user.id; // adding user id to the product    
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    });
})
// get all products
export const getAllProducts = handleAsyncError(async (req, res, next) => {
    const resultPerPage = 4;
    const apiFeatures = new APIFunctionality(Product.find(), req.query).search().filter()

    // getting filter query before pagination
    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();

    // calculating totaPages based on filtered count
    const totalPages = Math.ceil(productCount / resultPerPage);
    const page = Number(req.query.page) || 1;

    if (page > totalPages && productCount > 0) {
        return next(new HandleError("Page not found", 404));
    }
    // apply pagination
    apiFeatures.pagination(resultPerPage);
    const products = await apiFeatures.query;

    // if (!products || products.length === 0) {
    //     return next(new HandleError("No products found", 404));
    // }

    res.status(200).json({
        success: true,
        count: products.length,
        products,
        productCount,
        totalPages,
        resultPerPage,
        currentPage: page,
    });
  })

//   update product
export const updateProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        product,
    });
});

//  delete product
export const deleteProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});


// get single product
export const getSingleProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        product,
    });
});

//  creating and updating product reviews
export const createProductReview = handleAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };
    const product = await Product.findById(productId);
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }
    const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());
    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating, 
                rev.comment = comment;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    let avgRating = 0;
    product.reviews.forEach((rev) => {
        avgRating += rev.rating;
    });
    product.ratings = product.reviews.length === 0 ? 0 : avgRating / product.reviews.length;
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        message: "Review added successfully",
        product,
    });
});

// get all reviews of a product
export const getProductReviews = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        count: product.reviews.length,
        reviews: product.reviews,
    });
});

// delete product reviews
export const deleteProductReview = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }
    // filter out the review to be deleted
    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());
    const numOfReviews = reviews.length;
    let avgRating = 0;
    reviews.forEach((rev) => {
        avgRating += rev.rating;
    });
    // calculating average rating only if reviews exist
    const ratings = reviews.length === 0 ? 0 : avgRating / reviews.length;
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews,
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
    });
});

// admin: get all products
export const getAdminProducts = handleAsyncError(async (req, res, next) => {
    const products = await Product.find();
    if (!products || products.length === 0) {
        return next(new HandleError("No products found", 404));
    }
    res.status(200).json({
        success: true,
        count: products.length,
        products,
    });
});