import {
  configureStore,
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import {
  FormTypes,
  // StandUpConfigTypes,
} from "@/types/CardWithFormTypes";
import { StandupResponseTypes } from "@/types/StandupResponseTypes";
import { MoodEntry } from "@/types/MoodTypes";
import { api } from "@/services/api";

type LoadingTypes = "idle" | "pending" | "success" | "failed";

export interface KudosTypes {
  _id: string;
  giverId: string;
  receiverId: string;
  category: string;
  reason: string;
  teamId: string;
  timestamp: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface LeaderboardTypes {
  rank: number;
  userId: string;
  name: string;
  kudosCount: number;
}

export interface AppState {
  teams: FormTypes[];
  standups: StandupResponseTypes | null;
  moodEntries: MoodEntry[];
  members: { id: string; name: string }[];
  kudos: {
    kudos: KudosTypes[];
    pagination: Pagination | null;
  };
  leaderBoard: LeaderboardTypes[] | null;
  loading: {
    teams: LoadingTypes;
    updateTeam: LoadingTypes;
    deleteTeam: LoadingTypes;
    standups: LoadingTypes;
    moodEntries: LoadingTypes;
    members: LoadingTypes;
    kudos: LoadingTypes;
    leaderBoard: LoadingTypes;
  };
  error: string | null;
}

const initialState: AppState = {
  teams: [],
  standups: null,
  moodEntries: [],
  members: [],
  kudos: {
    kudos: [],
    pagination: null,
  },
  leaderBoard: null,
  loading: {
    teams: "idle",
    updateTeam: "idle",
    deleteTeam: "idle",
    standups: "idle",
    moodEntries: "idle",
    members: "idle",
    kudos: "idle",
    leaderBoard: "idle",
  },
  error: null,
};

// Async thunks
export const fetchTeams = createAsyncThunk("teams/fetchTeams", async () => {
  const response = await axios.get("http://localhost:5000/api/teams");
  return response.data;
});

export const addTeam = createAsyncThunk(
  "teams/addTeam",
  async (team: Omit<FormTypes, "_id">) => {
    const response = await axios.post("http://localhost:5000/api/teams", team);
    return response.data;
  }
);

export const updateTeam = createAsyncThunk(
  "teams/updateTeam",
  async (team: FormTypes, { rejectWithValue }) => {
    try {
      const response = await api.put("/teams/update", team);
      if (response.status !== 200) {
        throw new Error("Could not update team");
      }
      return response.data; // Return the updated team data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : error);
    }
  }
);

export const deleteTeam = createAsyncThunk(
  "teams/deleteTeam",
  async (id: string, { rejectWithValue }) => {
    try {
      console.log("slackChannelId:", id);
      const response = await api.delete(`/teams/${id}`);
      if (response.status !== 200) {
        throw new Error("Could not delete team");
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : error);
    }
  }
);

export const fetchStandups = createAsyncThunk(
  "standups/fetchStandups",
  async ({ page, limit }: { page?: number; limit?: number }) => {
    const response = await axios.get("http://localhost:5000/api/standups", {
      params: { page, limit },
    });
    console.log("status:", response.data);
    return response.data;
  }
);

export const fetchMember = createAsyncThunk("member/fetchMember", async () => {
  const response = await axios.get("http://localhost:5000/api/members");
  return response.data.users;
});

export const fetchMoodData = createAsyncThunk(
  "moods/fetchMoodData",
  async ({
    team,
    member,
    page,
    limit,
  }: {
    team: string | undefined;
    member: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
  }) => {
    const params = new URLSearchParams();

    if (team && team !== "All Teams") params.append("teamName", team);
    if (member && member !== "All Members") params.append("userName", member);
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    const response = await axios.get(
      `http://localhost:5000/api/mood/?${params.toString()}`
    );
    return await response.data;
  }
);

export const fetchKudos = createAsyncThunk(
  "kudos/fetchKudos",
  async ({
    teamMember,
    category,
    startDate,
    endDate,
    limit,
    page,
  }: {
    teamMember?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    page?: number;
  }) => {
    const params = new URLSearchParams();

    if (teamMember) params.append("teamMember", teamMember);
    if (category) params.append("category", category);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (limit) params.append("limit", String(limit));
    if (page) params.append("page", String(page));

    console.log("params:", params);

    const response = await axios.get(
      `http://localhost:5000/api/kudos/?${params.toString()}`
    );

    console.log("response from kudos:", response.data);

    return await response.data;
  }
);

export const fetchLeaderBoard = createAsyncThunk(
  "kudos/fetchLeaderBoard",
  async () => {
    const response = await axios.get(
      `http://localhost:5000/api/kudos/leaderboard`
    );

    return await response.data;
  }
);

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoading: (
      state,
      action: PayloadAction<{
        resource: keyof AppState["loading"];
        isLoading: LoadingTypes;
      }>
    ) => {
      const { resource, isLoading } = action.payload;
      state.loading[resource] = isLoading;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetUpdateTeamLoading: (state) => {
      state.loading.updateTeam = "idle"; // Reset to idle
    },
  },
  extraReducers: (builder) => {
    builder
      // Teams reducers
      .addCase(fetchTeams.pending, (state) => {
        state.loading.teams = "pending";
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.teams = action.payload;
        state.loading.teams = "success";
        state.error = null;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading.teams = "failed";
        state.error = action.error.message || "Failed to fetch teams";
      })
      .addCase(addTeam.fulfilled, (state, action) => {
        state.teams.push(action.payload);
      })
      .addCase(updateTeam.pending, (state) => {
        state.loading.updateTeam = "pending";
        state.error = null;
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.loading.updateTeam = "success";
        state.error = null;
        state.teams = state.teams.map((team) =>
          team._id === action.payload._id ? action.payload : team
        );
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.loading.updateTeam = "failed";
        state.error = action.payload as string; // Set the error message
      })
      .addCase(deleteTeam.pending, (state) => {
        state.loading.deleteTeam = "pending";
        state.error = null;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.teams = state.teams.filter((t) => t._id !== action.payload);
        state.loading.deleteTeam = "success";
        state.error = null;
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.loading.deleteTeam = "failed";
        state.error = action.error.message || "Failed to delete Team";
      })

      // Standups reducers
      .addCase(fetchStandups.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(fetchStandups.fulfilled, (state, action) => {
        state.standups = action.payload;
        // state.loading = false;
      })
      .addCase(fetchStandups.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.error.message || "Failed to fetch standups";
      })

      // members reducers
      .addCase(fetchMember.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(fetchMember.fulfilled, (state, action) => {
        state.members = action.payload;
        // state.loading = false;
      })
      .addCase(fetchMember.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.error.message || "Failed to fetch members";
      })

      // mood data reducers
      .addCase(fetchMoodData.pending, (state) => {
        state.loading.moodEntries = "pending";
        state.error = null;
      })
      .addCase(fetchMoodData.fulfilled, (state, action) => {
        state.loading.moodEntries = "success";
        state.moodEntries = action.payload;
      })
      .addCase(fetchMoodData.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch members";
      })

      // kudos data reducers.
      .addCase(fetchKudos.pending, (state) => {
        state.loading.kudos = "pending";
        state.error = null;
      })
      .addCase(fetchKudos.fulfilled, (state, action) => {
        state.kudos = action.payload;
      })
      .addCase(fetchKudos.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch kudos";
      })
      .addCase(fetchLeaderBoard.pending, (state) => {
        state.loading.leaderBoard = "pending";
      })
      .addCase(fetchLeaderBoard.fulfilled, (state, action) => {
        state.leaderBoard = action.payload;
      })
      .addCase(fetchLeaderBoard.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch leader board";
      });
  },
});

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export const { setLoading, setError, resetUpdateTeamLoading } =
  appSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
