/* eslint-disable no-unused-vars */
import axios from "axios";
import "../../assets/CSS/ReactContexify.css";
import { Base_URL } from "../../api/config";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import UseCookie from "../../hooks/useCookie";
import SongItem from "../Song/SongItem";

// eslint-disable-next-line react/prop-types
const SongPeriodSection = ({ titleSong, StartTime, EndTime }) => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [songList, setSongList] = useState([]);
  const [songPage, setSongPage] = useState(1);
  const titleSongChart = titleSong
    ? titleSong
    : `${
        new Date().getMonth() < 3
          ? "Top Songs in Spring"
          : new Date().getMonth() < 6
          ? "Top Songs in Summer"
          : new Date().getMonth() < 9
          ? "Top Songs in Autumn"
          : "Top Songs in Winter"
      }`;

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Adding 1 to get the correct month

  const startTime =
    StartTime ||
    `${currentYear}-${
      currentMonth - 1 < 10 ? `0${currentMonth - 1}` : currentMonth - 1
    }-01`;
  const endTime = EndTime || `${currentYear}-${currentMonth}-30`;

  const getListSongPeriod = async () => {
    try {
      const response = await axios.post(
        `${Base_URL}/songs/getTopSong?startTime=${startTime}&endTime=${endTime}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("Song Period", response.data);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    console.log("Time Detail", startTime, endTime);
    getListSongPeriod().then((response) => {
      setSongList(response);
    });
  }, [songPage]);
  if (!songList) {
    return (
      <div className="bg-[#FFFFFFCC] rounded-2xl max-xl:w-full m-auto xl:h-fit xl:ml-5 xl:mr-5 xl:mt-8 mt-4 pt-3 xl:pt-5 pl-3 xl:pl-5 pr-3 xl:pr-5 pb-3 xl:pb-5">
        <h1 className="text-[#2E3271] text-xl font-bold">
          Song Chart is updating...
        </h1>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFFCC] rounded-2xl max-xl:w-full m-auto xl:h-fit xl:ml-5 xl:mr-5 xl:mt-8 mt-4 pt-3 xl:pt-5 pl-3 xl:pl-5 pr-3 xl:pr-5 pb-3 xl:pb-5">
      <h1 className="text-[#2E3271] text-xl font-bold">{titleSongChart}</h1>
      <div className="xl:w-full">
        <div className="flex flex-row justify-between items-center mt-5 mb-5 text-[#4b4848]">
          <div className="flex flex-row gap-8 ml-8">
            <div className=" text-center font-bold">ID</div>
            <div className=" text-center font-bold">Song Details</div>
          </div>

          <div className="flex flex-row justify-center items-center ">
            <div className="mr-24">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 -960 960 960"
                width="20"
              >
                <path d="M170.87-81.413q-34.483 0-58.742-24.279-24.259-24.278-24.259-58.789v-426.432q0-27.783 13.859-51.902 13.859-24.12 39.402-34.033l534.935-194.565 25.717 69.435-351.804 128.543h439.116q34.819 0 58.928 24.271 24.109 24.271 24.109 58.77v426.264q0 34.5-24.259 58.609-24.259 24.108-58.742 24.108H170.87Zm0-83h618.26v-259.456H170.87v259.456Zm138.035-45.609q40.225 0 68.225-27.774 28-27.775 28-68 0-40.226-27.774-68.226-27.775-28-68-28-40.226 0-68.226 27.775t-28 68q0 40.225 27.775 68.225 27.775 28 68 28ZM170.87-495.869H648v-70.566h72v70.566h69.13v-94.566H170.87v94.566Zm0 331.456v-259.456 259.456Z" />
              </svg>
            </div>
            <div className=" text-center font-bold">Duration</div>
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {Array.isArray(songList) &&
            songList.slice(0, 10).map((songItem, index) => (
              <div key={index}>
                <SongItem
                  song={songItem.song}
                  songListen={songItem.count}
                  songOrder={index}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SongPeriodSection;
