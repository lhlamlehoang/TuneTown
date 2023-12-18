import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SongPlaylist from "./SongSectionPlaylist";
import { useMusicAPI } from "../../utils/songUtils";

const DetailPlaylist = () => {
  //http://localhost:8080/playlists/getPlaylistSongs?playlistId=102
  const { playlistId } = useParams();
  const { getListSongPlaylist, getPlaylistByPlaylistId } = useMusicAPI();
  const [songPlaylistList, setSongPlaylistList] = useState();
  const [playlistDetail, setPlaylistDetail] = useState({});

  const fetchDataPlaylistInfor = async (playlistId) => {
    const detailData = await getPlaylistByPlaylistId(playlistId);
    if (detailData) {
      setPlaylistDetail(detailData);
    }
    const data = await getListSongPlaylist(playlistId);
    if (data) {
      setSongPlaylistList(data);
      console.log("data", data);
    }
  };
  useEffect(() => {
    fetchDataPlaylistInfor(playlistId);
  }, [playlistId]);

  return (
    <div
      className={`${
        songPlaylistList != null && songPlaylistList.length > 0
          ? "min-h-screen h-full"
          : "min-h-screen"
      } xl:p-5 bg-[#ecf2fd] mb-20`}
    >
      <div className="flex flex-row gap-4">
        <button
          onClick={() => window.history.back()}
          className="bg-[#2f9948] hover:bg-[#40cf62] rounded-md mb-5"
        >
          <div className="text-white font-bold px-2 py-1">{"<"} Back</div>
        </button>
      </div>
      <div className="flex flex-row items-start text-7xl text-[#4b4848] font-bold text-center mb-5 gap-4">
        <div className="flex flex-row items-start relative">
          <img
            className="w-20 h-20 xl:w-56 xl:h-56 rounded-md"
            src={
              playlistDetail.coverArt
                ? playlistDetail.coverArt
                : "https://i.pinimg.com/550x/f8/87/a6/f887a654bf5d47425c7aa5240239dca6.jpg"
            }
            alt="artist-avatar"
          />
        </div>
        {playlistDetail.playlistName} <span className="">#{playlistId}</span>
      </div>

      <SongPlaylist
        playlistId={playlistId}
        songData={songPlaylistList}
      ></SongPlaylist>
    </div>
  );
};

export default DetailPlaylist;
