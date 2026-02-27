import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '@/lib/api';
import { extractApiError } from '@/lib/apiError';
import { getRefreshToken, setTokens, clearTokens } from '@/lib/auth';
import type { AuthState, AuthResponse, User } from '@/types';

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
    return rejectWithValue(extractApiError(error, 'Registration failed'));
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
    return rejectWithValue(extractApiError(error, 'Login failed'));
  }
});

// Use raw axios for refresh so the request interceptor does not overwrite
// the refresh token with the access token from localStorage
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
      // Always clear tokens — even if the server did not respond
      clearTokens();
    }
  },
);

// Called on app startup: refreshes tokens and loads user data
export const initializeAuth = createAsyncThunk<AuthResponse, void, { rejectValue: string }>(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      return rejectWithValue('No refresh token');
    }

    try {
      const { data: tokenData } = await axios.post<Pick<AuthResponse, 'accessToken' | 'refreshToken'>>(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        null,
        { headers: { Authorization: `Bearer ${refreshToken}` } },
      );

      setTokens(tokenData.accessToken, tokenData.refreshToken);

      const { data: user } = await axios.get<User>(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        { headers: { Authorization: `Bearer ${tokenData.accessToken}` } },
      );

      return { ...tokenData, user };
    } catch {
      clearTokens();
      return rejectWithValue('Session expired');
    }
  },
);

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  initialized: false,
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
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refreshTokens.rejected, () => initialState);

    builder
      .addCase(logoutUser.fulfilled, () => ({ ...initialState, initialized: true }))
      .addCase(logoutUser.rejected, () => ({ ...initialState, initialized: true }));

    builder
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.initialized = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.initialized = true;
      });

    builder.addMatcher(
      isAnyOf(registerUser.pending, loginUser.pending, refreshTokens.pending),
      (state) => {
        state.loading = true;
        state.error = null;
      },
    );

    builder.addMatcher(
      isAnyOf(registerUser.fulfilled, loginUser.fulfilled),
      (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.initialized = true;
      },
    );

    builder.addMatcher(
      isAnyOf(registerUser.rejected, loginUser.rejected),
      (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Auth failed';
      },
    );
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
