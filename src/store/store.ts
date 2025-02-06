import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";
import {
  FormTypes,
  // StandUpConfigTypes,
} from "@/types/CardWithFormTypes";
import { StandupResponseTypes } from "@/types/StandupResponseTypes";

interface AppState {
  teams: FormTypes[];
  standups: StandupResponseTypes | null;
  members: { id: string; name: string }[];
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  teams: [],
  standups: null,
  members: [],
  loading: false,
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
  async (team: FormTypes) => {
    const response = await axios.put(
      `http://localhost:5000/api/teams/${team._id}`,
      team
    );
    return response.data;
  }
);

export const deleteTeam = createAsyncThunk(
  "teams/deleteTeam",
  async (id: string) => {
    await axios.delete(`http://localhost:5000/api/teams/${id}`);
    return id;
  }
);

export const fetchStandups = createAsyncThunk(
  "standups/fetchStandups",
  async () => {
    const response = await axios.get("http://localhost:5000/api/standups");
    console.log("status:", response.data)
    return response.data;
  }
);

export const fetchMember = createAsyncThunk("member/fetchMember", async () => {
  const response = await axios.get("http://localhost:5000/api/members");
  return response.data.users;
});

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Teams reducers
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.teams = action.payload;
        state.loading = false;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch teams";
      })
      .addCase(addTeam.fulfilled, (state, action) => {
        state.teams.push(action.payload);
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        const index = state.teams.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.teams = state.teams.filter((t) => t._id !== action.payload);
      })

      // Standups reducers
      .addCase(fetchStandups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStandups.fulfilled, (state, action) => {
        state.standups = action.payload;
        state.loading = false;
      })
      .addCase(fetchStandups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch standups";
      })

      // members reducers
      .addCase(fetchMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMember.fulfilled, (state, action) => {
        state.members = action.payload;
        state.loading = false;
      })
      .addCase(fetchMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch members";
      });
  },
});

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
