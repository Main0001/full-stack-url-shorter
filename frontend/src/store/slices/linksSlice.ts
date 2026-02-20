import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '@/lib/api';
import type { LinksState, Link } from '@/types';

export const fetchLinks = createAsyncThunk<Link[], void, { rejectValue: string }>(
  'links/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<Link[]>('/links');
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message ?? 'Failed to fetch links');
      }
      return rejectWithValue('Network error');
    }
  },
);

export const createLink = createAsyncThunk<Link, { originalUrl: string }, { rejectValue: string }>(
  'links/create',
  async ({ originalUrl }, { rejectWithValue }) => {
    try {
      const { data } = await api.post<Link>('/links', { originalUrl });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        return rejectWithValue(Array.isArray(message) ? message[0] : (message ?? 'Failed to create link'));
      }
      return rejectWithValue('Network error');
    }
  },
);

export const deleteLink = createAsyncThunk<string, string, { rejectValue: string }>(
  'links/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/links/${id}`);
      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message ?? 'Failed to delete link');
      }
      return rejectWithValue('Network error');
    }
  },
);

const initialState: LinksState = {
  items: [],
  loading: false,
  error: null,
};

const linksSlice = createSlice({
  name: 'links',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch links';
      });

    builder
      .addCase(createLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLink.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to create link';
      });

    builder
      .addCase(deleteLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLink.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((link) => link.id !== action.payload);
      })
      .addCase(deleteLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to delete link';
      });
  },
});

export default linksSlice.reducer;
