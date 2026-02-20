// User
export interface User {
  id: string;
  email: string;
}

// Auth
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

// Link
export interface Link {
  id: string;
  originalUrl: string;
  shortUrl: string;
  statsUrl: string;
  shortCode: string;
  statsCode: string;
  clicks: number;
  createdAt: string;
}

// Click
export interface Click {
  id: string;
  linkId: string;
  ip: string | null;
  country: string | null;
  city: string | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  referrer: string | null;
  createdAt: string;
}

// Stats
export interface StatsResponse {
  link: {
    originalUrl: string;
    createdAt: string;
  };
  data: Click[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StatsSummary {
  link: {
    originalUrl: string;
    createdAt: string;
  };
  total: number;
  byCountry: { country: string; count: number }[];
  byBrowser: { browser: string; count: number }[];
  byOs: { os: string; count: number }[];
  byDate: { date: string; count: number }[];
}

// Redux state
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LinksState {
  items: Link[];
  loading: boolean;
  error: string | null;
}

export interface StatsState {
  stats: StatsResponse | null;
  summary: StatsSummary | null;
  loading: boolean;
  error: string | null;
}
