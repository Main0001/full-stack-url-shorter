import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { LinksState, Link } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchLinks = createAsyncThunk<
  Link[],
  string,
  { rejectValue: string }
>('links/fetchAll', async (accessToken, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/links`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      return rejectWithValue('Failed to fetch links');
    }

    return res.json();
  } catch {
    return rejectWithValue('Network error');
  }
});

export const createLink = createAsyncThunk<
  Link,
  { originalUrl: string; accessToken: string },
  { rejectValue: string }
>('links/create', async ({ originalUrl, accessToken }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ originalUrl }),
    });

    if (!res.ok) {
      const error = await res.json();
      return rejectWithValue(error.message ?? 'Failed to create link');
    }

    return res.json();
  } catch {
    return rejectWithValue('Network error');
  }
});

export const deleteLink = createAsyncThunk<
  string,
  { id: string; accessToken: string },
  { rejectValue: string }
>('links/delete', async ({ id, accessToken }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/links/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      return rejectWithValue('Failed to delete link');
    }

    return id;
  } catch {
    return rejectWithValue('Network error');
  }
});

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
