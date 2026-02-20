import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '@/lib/api';
import type { StatsState, StatsResponse, StatsSummary } from '@/types';

export const fetchStats = createAsyncThunk<
  StatsResponse,
  { statsCode: string; page?: number; limit?: number },
  { rejectValue: string }
>('stats/fetch', async ({ statsCode, page = 1, limit = 10 }, { rejectWithValue }) => {
  try {
    const { data } = await api.get<StatsResponse>(`/stats/${statsCode}`, {
      params: { page, limit },
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message ?? 'Stats not found');
    }
    return rejectWithValue('Network error');
  }
});

export const fetchSummary = createAsyncThunk<StatsSummary, string, { rejectValue: string }>(
  'stats/fetchSummary',
  async (statsCode, { rejectWithValue }) => {
    try {
      const { data } = await api.get<StatsSummary>(`/stats/${statsCode}/summary`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message ?? 'Summary not found');
      }
      return rejectWithValue('Network error');
    }
  },
);

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
