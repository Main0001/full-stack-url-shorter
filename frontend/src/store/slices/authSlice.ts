import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '@/lib/api';
import { setTokens, clearTokens } from '@/lib/auth';
import type { AuthState, AuthResponse } from '@/types';

export const registerUser = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>('auth/register', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post<AuthResponse>('/auth/register', credentials);
    setTokens(data.accessToken, data.refreshToken);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      return rejectWithValue(Array.isArray(message) ? message[0] : (message ?? 'Registration failed'));
    }
    return rejectWithValue('Network error');
  }
});

export const loginUser = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    setTokens(data.accessToken, data.refreshToken);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      return rejectWithValue(Array.isArray(message) ? message[0] : (message ?? 'Login failed'));
    }
    return rejectWithValue('Network error');
  }
});

// Для refresh используем raw axios, чтобы request interceptor не перезаписал
// refresh token access token-ом из localStorage
export const refreshTokens = createAsyncThunk<
  Pick<AuthResponse, 'accessToken' | 'refreshToken'>,
  string,
  { rejectValue: string }
>('auth/refresh', async (refreshToken, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<Pick<AuthResponse, 'accessToken' | 'refreshToken'>>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      null,
      { headers: { Authorization: `Bearer ${refreshToken}` } },
    );
    setTokens(data.accessToken, data.refreshToken);
    return data;
  } catch {
    return rejectWithValue('Token refresh failed');
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue('Logout failed');
      }
      return rejectWithValue('Network error');
    } finally {
      // Токены всегда чистим — даже если сервер не ответил
      clearTokens();
    }
  },
);

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthResponse>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    clearCredentials() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Registration failed';
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Login failed';
      });

    builder
      .addCase(refreshTokens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refreshTokens.rejected, () => {
        return initialState;
      });

    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, () => {
        return initialState;
      })
      .addCase(logoutUser.rejected, () => {
        return initialState;
      });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
