import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { StatsState, StatsResponse, StatsSummary } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchStats = createAsyncThunk<
  StatsResponse,
  { statsCode: string; page?: number; limit?: number },
  { rejectValue: string }
>('stats/fetch', async ({ statsCode, page = 1, limit = 10 }, { rejectWithValue }) => {
  try {
    const res = await fetch(
      `${API_URL}/stats/${statsCode}?page=${page}&limit=${limit}`,
    );

    if (!res.ok) {
      return rejectWithValue('Stats not found');
    }

    return res.json();
  } catch {
    return rejectWithValue('Network error');
  }
});

export const fetchSummary = createAsyncThunk<
  StatsSummary,
  string,
  { rejectValue: string }
>('stats/fetchSummary', async (statsCode, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/stats/${statsCode}/summary`);

    if (!res.ok) {
      return rejectWithValue('Summary not found');
    }

    return res.json();
  } catch {
    return rejectWithValue('Network error');
  }
});

const initialState: StatsState = {
  stats: null,
  summary: null,
  loading: false,
  error: null,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    clearStats: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch stats';
      });

    builder
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch summary';
      });
  },
});

export const { clearStats } = statsSlice.actions;
export default statsSlice.reducer;
