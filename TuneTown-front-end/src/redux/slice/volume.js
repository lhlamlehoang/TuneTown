import { createSlice } from "@reduxjs/toolkit";

const volumeSlice = createSlice({
  name: "volume",
  initialState: {
    volumeValue: 0,
  },
  reducers: {
    setVolume: (state, action) => {
      state.volumeValue = action.payload;
    },
  },
});

export const { setVolume } = volumeSlice.actions;
export default volumeSlice.reducer;
