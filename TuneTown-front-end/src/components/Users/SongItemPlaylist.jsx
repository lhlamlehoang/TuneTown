/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addSongToQueue,
  setCurrentSong,
  setCurrentTime,
  setIsPlaying,
} from "../../redux/slice/music";
import useSongDuration, { useMusicAPI } from "../../utils/songUtils";
import DefaultArt from "../../assets/img/CoverArt/starboy.jpg";
import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
} from "react-contexify";
import { message } from "antd";
import { setRefreshPlaylist } from "../../redux/slice/playlist";
import axios from "axios";
import { Base_URL } from "../../api/config";
import UseCookie from "../../hooks/useCookie";

const SongItemPlaylist = ({
  song,
  songId,
  songOrder,
  songIndex,
  playlistId,
}) => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const { id, songName, artists, poster, songData } = song;
  const { show } = useContextMenu();
  const userId = localStorage.getItem("userId");
  const {
    addSongToPlaylist,
    getUserPlaylist,
    deleteSongInPlaylist,
    addSongToHistory,
  } = useMusicAPI();
  const { showArtistV2, TimeConvert } = useSongDuration();
  const dispatch = useDispatch();
  const audioRef = useRef();
  const isPlaying = useSelector((state) => state.music.isPlaying);
  const songInfor = useSelector((state) => state.music.currentSong);
  const audio = document.getElementById("audio");
  const [playlistList, setPlaylistList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const draggableSong = useSelector((state) => state.playlist.draggable);
  const refreshPlaylist = useSelector(
    (state) => state.playlist.refreshPlaylist
  );
  const [dragOver, setDragOver] = useState(null);

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
  const HandleRefreshPlaylist = () => {
    dispatch(setRefreshPlaylist(!refreshPlaylist));
  };

  // When the song is deleted, refresh the playlist
  const handleDeleteSong = () => {
    deleteSongInPlaylist(songId, localStorage.getItem("myPlaylistId")).then(
      (response) => {
        console.log("Delete song response", response);
        if (response === 200) {
          messageApi.success(`Deleted ${songInforObj.songName} in playlist`);
          // Trigger a re-render by updating the refresh state
          dispatch(setRefreshPlaylist(true));
        } else {
          messageApi.error(`Failed to delete song: ${response.error}`);
        }
      }
    );
  };

  // Sort
  async function handleSort(item, over) {
    const response = await axios.post(
      `${Base_URL}/playlistSongs/orderSong?songOrder=${item}&playlistId=${playlistId}
    &anotherSongOrder=${over}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    if (response.status === 200) {
      messageApi.success(`Order ${item} to ${over}`);
      dispatch(setRefreshPlaylist(true));
      getUserPlaylist(userId).then((data) => setPlaylistList(data));
    } else {
      messageApi.error(`Failed to order song: ${response.error}`);
    }
  }

  useEffect(() => {
    console.log("SongId", songId);
    getUserPlaylist(userId).then((data) => setPlaylistList(data));
    if (refreshPlaylist == true) {
      getUserPlaylist(userId).then((data) => {
        setPlaylistList(data);
        dispatch(setRefreshPlaylist(false));
      });
    }
  }, [refreshPlaylist]);
  return (
    <div onContextMenu={(e) => displayMenu(e, songInforObj.id)}>
      {contextHolder}
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
        <Item
          onClick={() => {
            handleDeleteSong();
          }}
        >
          Delete Song
        </Item>
        <Separator />
        <Submenu label="Add to playlist">
          {playlistList.map((playlist) => (
            <Item
              key={playlist.id}
              onClick={() => {
                addSongToPlaylist(songInforObj.id, playlist.id).then(
                  (result) => {
                    if (result.success) {
                      messageApi.success(
                        `Added ${songInforObj.songName} #${songInforObj.id} to ${playlist.playlistName} #${playlist.id}`
                      );
                    } else {
                      messageApi.error(`Failed to add song: ${result.error}`);
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

      <div
        className="flex flex-row relative hover:bg-slate-200 bg-white items-center rounded-xl text-sm xl:text-base p-2 my-1 cursor-pointer"
        draggable={draggableSong}
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", songOrder);
        }}
        onDragEnter={() => {
          setDragOver(songIndex + 1);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          const draggedItem = e.dataTransfer.getData("text/plain");
          handleSort(draggedItem, dragOver);
        }}
      >
        {
          <div
            className=" xl:w-12 xl:h-12
        mx-2 xl:mx-3  flex justify-center items-center text-[#464444] font-bold
        "
          >
            <span>{songOrder}</span>
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
        <div className="absolute right-4 flex flex-row items-center gap-1 xl:gap-10">
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
          {draggableSong == true && <button>=</button>}
        </div>
      </div>
    </div>
  );
};

export default SongItemPlaylist;
