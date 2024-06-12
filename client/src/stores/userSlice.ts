import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "@/utils/newRequest";

interface UserData {
  _id: string;
  googleId?: string;
  username: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  credits: number;
}

// Function to update userData.credits in local storage
export const updateCreditsInLocalStorage = (credits: number) => {
  // Get userData from local storage
  const userDataString = localStorage.getItem("userData");

  // If userData exists in local storage, update credits and set it back to local storage
  if (userDataString) {
    const userData: UserData = JSON.parse(userDataString);
    userData.credits += credits;
    localStorage.setItem("userData", JSON.stringify(userData));
  }
};

export const fetchUserData = createAsyncThunk<UserData>(
  "user/fetchUserData",
  async () => {
    try {
      // const { data } = await Axios.get<UserData>("/oauth/get-user");
      // /* check if the user signed in with google account , and if so , set google user id to localStorage
      //  and get it into API that will find the user in database */
      // if (data) {
      //   const googleUserId = data.googleId;
      //   localStorage.setItem("userId", JSON.stringify(googleUserId));
      //   const response = await Axios.get<UserData>(
      //     `/users/get-user-data/${googleUserId}`
      //   );
      //   return response.data;
      // }
      /* if user signed in with manually created account then the id will be in localStorage based on 
      login functionality */
      const userId = localStorage.getItem("userId");
      const response = await Axios.get<UserData>(
        `/users/get-user-data/${userId}`
      );
      return response.data;
    } catch (error) {
      // Handle errors
      console.error("Error fetching user data:", error);
      throw error;
    }
  }
);

export const fetchGoogleUserData = createAsyncThunk<any>(
  "user/fetchGoogleUserData",
  async () => {
    try {
      const { data } = await Axios.get("/oauth/get-user");
      return data;
    } catch (error) {
      console.error("Error fetching Google user data:", error);
      throw error;
    }
  }
);

interface UserState {
  userData: UserData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  userData: null,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Define your reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message ?? "Unknown error";
      });
  },
});

export default userSlice.reducer;
