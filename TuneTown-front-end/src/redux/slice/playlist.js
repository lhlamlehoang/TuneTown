import { createSlice } from "@reduxjs/toolkit";

const playlistStore = createSlice({
  name: "playlist",
  initialState: {
    refreshPlaylist: false,
    playlistIsPlaying: false,
    myPlaylistLists: [],
    id: 0,
    playlistName: "",
    user: {
      id: 0,
      userName: "",
      email: "",
      password: "",
      role: "",
      birthDate: "",
      userBio: null,
      avatar: null,
      history: [],
      favoriteGenres: [],
      followingArtists: [],
    },
    playlistType: "",
    coverArt: null,
    playlistSongsList: null,
    draggable: false,
  },
  reducers: {
    setPlaylist: (state, action) => {
      state.playlist = action.payload;
    },
    setMyPLaylistList: (state, action) => {
      state.myPlaylistLists = action.payload;
    },
    setRefreshPlaylist: (state, action) => {
      state.refreshPlaylist = action.payload;
    },
    setDraggable: (state, action) => {
      state.draggable = action.payload;
    },
    setPlaylistIsPlaying: (state, action) => {
      state.playlistIsPlaying = action.payload;
    },
  },
});

export const {
  setPlaylist,
  setMyPLaylistList,
  setRefreshPlaylist,
  setPlaylistIsPlaying,
  setDraggable,
} = playlistStore.actions;
export default playlistStore.reducer;
