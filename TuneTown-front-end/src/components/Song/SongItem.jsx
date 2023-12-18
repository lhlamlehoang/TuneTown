/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addSongToQueue,
  setCurrentSong,
  setCurrentTime,
  setIsPlaying,
} from "../../redux/slice/music";
import useSongDuration, { useMusicAPI } from "../../utils/songUtils";
import DefaultArt from "../../assets/img/logo/logo.png";
import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
} from "react-contexify";
import { message } from "antd";

const SongItem = ({ song, songOrder, songListen }) => {
  const { id, songName, artists, poster, songData } = song;
  const audioRef = useRef();
  const { show } = useContextMenu();
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const { addSongToPlaylist, getUserPlaylist, addSongToHistory } =
    useMusicAPI();
  const { showArtistV2, TimeConvert } = useSongDuration();
  const isPlaying = useSelector((state) => state.music.isPlaying);
  const songInfor = useSelector((state) => state.music.currentSong);
  // const audio = document.getElementById("audio");
  const [playlistList, setPlaylistList] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const songInforObj = {
    id: id,
    songName: songName,
    artists: artists.map((artist) => artist),
    songDuration: songInfor.songDuration,
    songCover: poster,
    songData: songData,
  };

  // When click to the song, save the current song to the context and play it
  const HandlePlay = () => {
    addSongToHistory(userId, songInforObj.id);
    dispatch(setCurrentTime(0));
    // Send Song information to the store
    dispatch(setCurrentSong(songInforObj));
    // dispatch(setSongLinks(songInforObj.songLink));
    if (isPlaying == false) {
      dispatch(setIsPlaying(!isPlaying));
    }
  };
  // const songDuration = GetSongDuration(songData);

  function displayMenu(e, songId) {
    console.log("PlaylistList", playlistList);
    e.preventDefault();
    show({
      position: { x: e.clientX, y: e.clientY },
      event: e,
      id: `songOption_${songId}`,
    });
  }

  // Call this function when you want to refresh the playlist
  const refreshPlaylist = () => {
    setRefresh(!refresh);
  };
  useEffect(() => {
    // Add list playlist to context menu
    getUserPlaylist(userId).then((data) => setPlaylistList(data));
  }, []);

  return (
    <div onContextMenu={(e) => displayMenu(e, songInforObj.id)}>
      {/* Context Menu */}
      <Menu id={`songOption_${songInforObj.id}`}>
        <Item onClick={refreshPlaylist}>Refresh</Item>
        <Item
          onClick={() => {
            dispatch(addSongToQueue(songInforObj));
          }}
        >
          Add to Queue
        </Item>
        <Separator />
        <Submenu label="Add to playlist">
          {playlistList &&
            playlistList.map((playlist) => (
              <Item
                key={playlist.id}
                onClick={() => {
                  addSongToPlaylist(songInforObj.id, playlist.id).then(
                    (result) => {
                      if (result.success) {
                        message.success(
                          `Added ${songInforObj.songName} #${songInforObj.id} to ${playlist.playlistName} #${playlist.id}`
                        );
                      } else {
                        message.error(`Failed to add song: ${result.error}`);
                      }
                    }
                  );
                }}
              >
                {playlist.playlistName}{" "}
                <span className="text-[#938e8e] ml-1"> #{playlist.id}</span>
              </Item>
            ))}
        </Submenu>
      </Menu>

      <div className="flex flex-row relative hover:bg-slate-200 bg-white items-center rounded-md text-sm xl:text-base p-2 my-1 cursor-pointer">
        {
          <div
            className="xl:w-12 xl:h-12
        mx-2 xl:mx-3  flex justify-center items-center text-[#464444] font-bold
        "
          >
            <span>{songOrder + 1}</span>
          </div>
        }
        <img
          className="mr-3 w-12 h-12 xl:w-14 xl:h-14 rounded-lg object-cover"
          alt="Album cover"
          src={poster ? poster : DefaultArt}
        />
        {/* // Audio element */}
        <audio ref={audioRef} src={songInforObj.songLink}></audio>
        <div className="text-[#2E3271] xl:text-base font-semibold">
          <h2 className="">{songInforObj.songName}</h2>
          <h2 className="text-sm text-[#7C8DB5B8] mt-1">
            {artists && showArtistV2(artists)}
            {!artists && <span>Null</span>}
          </h2>
        </div>
        <div></div>
        <div className="absolute right-4 flex flex-row items-center gap-1 xl:gap-10">
          {songListen && (
            <div className="flex flex-row items-center justify-center text-[#464444] font-semibold gap-1">
              {songListen}{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 -960 960 960"
                width="20"
              >
                <path d="M365.537-164.001H228.309q-26.308 0-45.308-19t-19-45.308V-480q0-65.769 24.97-123.248 24.969-57.479 67.905-100.246 42.937-42.766 100.646-67.635 57.709-24.87 122.978-24.87 65.269 0 122.748 24.87 57.479 24.869 100.246 67.635 42.766 42.767 67.635 100.246 24.87 57.479 24.87 123.248v251.691q0 26.308-18.65 45.308t-45.658 19H594.463v-251.075H744V-480q0-110.314-76.778-187.157Q590.443-744 480.222-744 370-744 293-667.157 216-590.314 216-480v64.924h149.537v251.075Zm-51.998-199.076H216v134.768q0 4.616 3.846 8.463 3.847 3.846 8.463 3.846h85.23v-147.077Zm332.922 0V-216h85.23q4.616 0 8.463-3.846 3.846-3.847 3.846-8.463v-134.768h-97.539Zm-332.922 0H216h97.539Zm332.922 0H744h-97.539Z" />
              </svg>
            </div>
          )}
          <button
            className="hover:bg-slate-300 rounded-2xl p-1"
            onClick={HandlePlay}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {/* <div>{TimeConvert(songInforObj.songDuration)}</div> */}
          <div>{TimeConvert(234)}</div>
        </div>
      </div>
    </div>
  );
};

export default SongItem;
