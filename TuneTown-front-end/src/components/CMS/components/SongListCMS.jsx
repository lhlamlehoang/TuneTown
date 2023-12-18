import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import UseCookie from "../../../hooks/useCookie";
import { Base_URL } from "../../../api/config";
import axios from "axios";
import SongItem from "../../HomePage/SongItem";

/* eslint-disable no-unused-vars */
const SongListCMS = () => {
  const dispatch = useDispatch();
  const [songList, setSongList] = useState([]);
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [hasMoreSongs, setHasMoreSongs] = useState(false);
  const [songPage, setSongPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [refresh, setRefresh] = useState(false);
  // Call this function when you want to refresh the playlist
  const refreshPlaylist = () => {
    setRefresh(!refresh);
    getListSong(songPage);
  };

  const getListSong = async (songPage) => {
    try {
      console.log("auth", access_token);
      const response = await axios.get(`${Base_URL}/songs?page=${songPage}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const { songList, currentPage, totalPages } = response.data;
      console.log("songList Response", songList, currentPage, totalPages);
      if (response.data) {
        setSongList((prevSongList) => [...prevSongList, ...songList]);
        setTotalPages(totalPages);
        setSongPage(currentPage);
        if (currentPage >= totalPages) {
          setHasMoreSongs(false);
        }
      }
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const deleteSong = async (songId) => {
    try {
      confirm(`Are you sure you want to delete this playlist?`);
      if (confirm) {
        console.log("auth", access_token);
        const response = await axios.delete(
          `${Base_URL}/songs/deleteSong?songId=${songId}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        // Refresh the component
        refreshPlaylist();
        return response.data;
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    getListSong(songPage);
  }, [songPage]);
  if (!songList) return null;
  return (
    <div className="xl:w-full">
      <div className="mt-2 flex flex-col gap-2">
        {songList &&
          songList.map((songItem) => (
            <div
              onContextMenu={(event) => {
                event.preventDefault();
                deleteSong(songItem.id);
              }}
              key={songItem.id}
            >
              <SongItem song={songItem} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default SongListCMS;
