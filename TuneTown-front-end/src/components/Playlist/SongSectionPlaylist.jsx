/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import SongItem from "../Song/SongItem";
// import { useDispatch } from "react-redux";

const SongSectionPlaylist = (props) => {
  const [songList, setSongList] = useState();
  useEffect(() => {
    setSongList(props.songData);
    console.log("songPlaylsit || SongList", songList);
  }, [props.songData]);
  if (!songList) return null;
  return (
    <div className="xl:w-full w-full bg-[#ecf2fd]">
      <div className="flex flex-row justify-between items-center mt-5 mb-5 text-[#4b4848]">
        <div className="flex flex-row gap-8 ml-8">
          <div className=" text-center font-bold">ID</div>
          <div className=" text-center font-bold">Song Details</div>
        </div>
        <div>
          <div className=" text-center font-bold">Duration</div>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        {songList &&
          songList.map((songItem) => (
            <SongItem
              key={songItem.id}
              songOrder={songItem.orderSong}
              song={songItem.song}
            />
          ))}
      </div>
    </div>
  );
};

export default SongSectionPlaylist;
