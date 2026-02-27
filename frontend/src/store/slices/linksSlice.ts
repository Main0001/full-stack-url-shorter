import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { extractApiError } from '@/lib/apiError';
import type { LinksState, Link } from '@/types';

export const fetchLinks = createAsyncThunk<Link[], void, { rejectValue: string }>(
  'links/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<Link[]>('/links');
      return data;
    } catch (error) {
      return rejectWithValue(extractApiError(error, 'Failed to fetch links'));
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
      return rejectWithValue(extractApiError(error, 'Failed to create link'));
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
      return rejectWithValue(extractApiError(error, 'Failed to delete link'));
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
      .addCase(fetchLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(createLink.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(deleteLink.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((link) => link.id !== action.payload);
      });

    builder.addMatcher(
      isAnyOf(fetchLinks.pending, createLink.pending, deleteLink.pending),
      (state) => {
        state.loading = true;
        state.error = null;
      },
    );

    builder.addMatcher(
      isAnyOf(fetchLinks.rejected, createLink.rejected, deleteLink.rejected),
      (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Request failed';
      },
    );
  },
});

export default linksSlice.reducer;
