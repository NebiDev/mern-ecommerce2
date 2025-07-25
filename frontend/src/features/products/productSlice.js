import {createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

import axios from 'axios';


export const getProduct = createAsyncThunk(
    'product/getProduct',
    async ({keyword, page=1, category}, { rejectWithValue }) => {
      try {
        let link = '/api/v1/products?page='+page;
        if(category){
          link += `&category=${encodeURIComponent(category)}`;
        }
        if(keyword){
          link += `&keyword=${encodeURIComponent(keyword)}`;
        }


        
        const { data } = await axiosInstance.get(link); // Destructure data directly
        // console.log('Response', data);
        return data; //  This is crucial
      } catch (error) {
        return rejectWithValue(
          error.response?.data.message || 'Something went wrong!'
        );
      }
    }
  );

  // product details
  export const getProductDetails = createAsyncThunk(
    'product/getProductDetails',
    async (id, { rejectWithValue }) => {
      try {
        const link = `/api/v1/product/${id}`;
        const { data } = await axiosInstance.get(link); // Destructure data directly
        // console.log('Response', data);
        return data; //  This is crucial
      } catch (error) {
        return rejectWithValue(
          error.response?.data.message || 'Something went wrong!'
        );
      }


    }
  );
  

const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        productCount: 0,
        loading: false,
        error: null,
        product: null,
        resultsPerPage: 0,
        totalPages: 0,
    },
    reducers:{
        removeErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                // console.log('Fulfilled action payload', action.payload);
                state.loading = false;
                state.error = null;
                state.products = action.payload.products;
                state.productCount = action.payload.productCount;
                state.resultsPerPage = action.payload.resultPerPage;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong!';
                state.products = [];
                
            })
           
            builder
            .addCase(getProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductDetails.fulfilled, (state, action) => {
                // console.log('Fulfilled action payload', action.payload);
                state.loading = false;
                state.error = null;
                state.product = action.payload.product;
            })
            .addCase(getProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong!';
                
            })
    }

    
})

export const {removeErrors} = productSlice.actions
export default productSlice.reducer