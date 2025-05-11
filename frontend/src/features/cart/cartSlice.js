import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';





// add items to cart
export const addItemsToCart = createAsyncThunk(
    'cart/addItemsToCart',
    async ({id, quantity}, { rejectWithValue }) => {
      try {
        const { data } = await axiosInstance.get(`/api/v1/product/${id}`); // Destructure data directly
        // console.log(data);
        return {
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.image[0].url,
            stock: data.product.stock,
            quantity,
        }


      } catch (error) {
        return rejectWithValue(
          error.response?.data.message || 'Something went wrong!'
        );
      }
    }
  );






const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
        loading: false,
        error: null,
        success: false,
        message: null,
        removingId: null,
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        },
        removeMessages: (state) => {
            state.message = null;
        },
        resetSuccess: (state) => {
            state.success = false;
        },
        removeItemFromCart: (state, action) => {
            const productId = action.payload;
            state.removingId = productId;
            state.cartItems = state.cartItems.filter((item) => item.product !== productId);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            state.removingId = null;
            state.message = "Item removed from cart successfully!";
        },

    },

    extraReducers: (builder) => {
        builder
            .addCase(addItemsToCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addItemsToCart.fulfilled, (state, action) => {
                const item = action.payload;
                const existingItem = state.cartItems.find((i) => i.product === item.product);
                if(existingItem){
                    existingItem.quantity = item.quantity;
                    state.message = `updated ${item.name} quantity in the cart`;

                } else{
                    state.cartItems.push(item);
                    state.message = `${item.name} added to cart successfully!`;
                }               
                state.loading = false;
                state.error = null;
                state.success = true;
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
                // console.log(state.cartItems);
                
                
            })
            .addCase(addItemsToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }

})


export const { removeErrors, removeMessages, resetSuccess, removeItemFromCart } = cartSlice.actions;
export default cartSlice.reducer;