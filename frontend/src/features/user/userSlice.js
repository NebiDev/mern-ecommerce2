
import {createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';



// Register API
export const register = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };
      const { data } = await axiosInstance.post('/api/v1/register', userData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Registration failed. Please try again.');
    }
  }
);

// Login API
export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };
      const { data } = await axiosInstance.post('/api/v1/login', { email, password }, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Login failed. Please try again.');
    }
  }
);


// Load User API
export const loadUser = createAsyncThunk(
  'user/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/api/v1/profile');
      return data;
    } catch (error) {
      if (error.response?.status === 401) return rejectWithValue(null);
      return rejectWithValue(error.response?.data?.error || 'Failed to load user. Please try again.');
    }
  }
);



// Logout API
export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/api/v1/logout');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Logout failed. Please try again.');
    }
  }
);

// Update Profile API
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };
      const { data } = await axiosInstance.put('/api/v1/profile/update', userData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update profile. Please try again.');
    }
  }
);

// Update Password API
export const updatePassword = createAsyncThunk(
  'user/updatePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };
      const { data } = await axiosInstance.put('/api/v1/password/update', passwordData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update password. Please try again.');
    }
  }
);

// Forgot Password API
export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };
      const { data } = await axiosInstance.post('/api/v1/password/forgot', { email }, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to send password reset link. Please try again.');
    }
  }
);

// Reset Password API
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ token, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };
      const { data } = await axiosInstance.put(`/api/v1/password/reset/${token}`, { newPassword, confirmPassword }, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to reset password. Please try again.');
    }
  }
);
  


const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        loading: false,
        error: null,
        success: false,
        isAuthenticated: false,
        message: null,
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        },
        removeSuccess: (state) => {
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload?.success;
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user)
                
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Registration failed';
                state.user = null;
                state.isAuthenticated = false;
            })


            // Login
            builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload?.success;
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user)
                // console.log(state.user)
                
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'login failed';
                state.user = null;
                state.isAuthenticated = false;
            })

            // Load User
            builder
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user)
                
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || null;
            })

            // Logout
            builder
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload?.success;
                state.user = null;
                state.isAuthenticated = false;
                
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Logout failed';
                state.user = null;
                state.isAuthenticated = false;
            })

            // Update Profile
            builder
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null; //prevent stale success messages
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload?.success;
                state.user = action.payload?.user || null;
                state.message = action.payload?.message || null;
                state.isAuthenticated = Boolean(action.payload?.user)
                
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update profile';
            })

            // Update Password
            builder
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload?.success;
                state.message = action.payload?.message || null;
                
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update password';
            })

            // Forgot Password
            builder
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload?.success;
                state.message = action.payload?.message || null;
                
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to send password reset link';
            })

            // Reset Password
            builder
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload?.success;
                state.message = action.payload?.message || null;
                state.isAuthenticated = false;

                
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to reset password';
            })





    },
})




export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;