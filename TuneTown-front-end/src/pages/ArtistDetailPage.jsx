import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Base_URL } from "../api/config";
import UseCookie from "../hooks/useCookie";
import defaultAva from "../assets/img/logo/logo.png";
import SongItem from "../components/Song/SongItem";

const ArtistDetailPage = () => {
  const { artistId } = useParams();
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [artistDetail, setArtistDetail] = useState({});
  const [songListArtist, setSongListArtist] = useState([]);
  const [follow, setFollow] = useState(false);
  const handleFollow = () => {
    setFollow(!follow);
  };
  const getArtistByArtistId = async (artistId) => {
    try {
      const response = await axios.post(
        `${Base_URL}/users/getArtistDetail?artistId=${artistId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("getArtistByArtistId Response", response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // const artistDetailTest = {
  //   artistName: "One Direction",
  //   artistAvatar:
  //     "https://upload.wikimedia.org/wikipedia/commons/e/e1/One_Direction_2015.jpg",
  // };
  const handleGetArtistDetail = async (artistId) => {
    await getArtistByArtistId(artistId).then((result) => {
      setArtistDetail(result);
      setSongListArtist(result.songs);
      console.log("SetArtistDetail", result);
      console.log("SetSongListArtist", songListArtist);
    });
  };
  useEffect(() => {
    handleGetArtistDetail(artistId);
  }, [artistId]);
  if (songListArtist == null) return null;

  return (
    <div
      className={`${
        artistId ? "min-h-screen h-full" : "min-h-screen"
      } xl:p-5 bg-[#ecf2fd] mb-20`}
    >
      <div className="flex flex-row items-center justify-start gap-4">
        <div className="flex flex-row items-start mt-5 mb-5 relative">
          <img
            className="w-20 h-20 xl:w-56 xl:h-56 rounded-md"
            src={
              artistDetail.artistAvatar ? artistDetail.artistAvatar : defaultAva
            }
            alt="artist-avatar"
          />
        </div>
        <div className="flex flex-col">
          <div className="text-[50px] text-[#4b4848] font-bold text-center mb-5">
            {artistDetail.name ? artistDetail.name : "Unknown Artist"}{" "}
            <span className="text-gray-500">#{artistDetail.id}</span>
          </div>
          {
            <div className="flex flex-row gap-4">
              <button
                onClick={() => handleFollow()}
                className="bg-[#2f9948bc] hover:bg-[#40cf62] rounded-md mb-5"
              >
                <div className="text-white font-bold px-2 py-1">
                  {follow == true ? "Unfollow" : "Follow"}
                </div>
              </button>
            </div>
          }
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <button
          onClick={() => window.history.back()}
          className="bg-[#2f9948] hover:bg-[#40cf62] rounded-md mb-5"
        >
          <div className="text-white font-bold px-2 py-1">{"<"} Back</div>
        </button>
      </div>

      {/* <SongSectionPlaylist songData={artistDetail.songs}></SongSectionPlaylist> */}
      {artistDetail.songs && (
        <div className="bg-[#FFFFFFCC] rounded-xl m-auto ml-2 mr-2 mt-2 pt-2 pl-5 pr-5 pb-5">
          <div className="flex flex-row justify-between items-center mt-5 mb-5 text-[#4b4848]">
            <div className="flex flex-row gap-8 ml-8">
              <div className=" text-center font-bold">ID</div>
              <div className=" text-center font-bold">Song Details</div>
            </div>
            <div>
              <div className=" text-center font-bold">Duration</div>
            </div>
          </div>
          {artistDetail.songs.map((songItem, index) => (
            <SongItem
              key={songItem.id || index}
              songOrder={index}
              song={songItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistDetailPage;
