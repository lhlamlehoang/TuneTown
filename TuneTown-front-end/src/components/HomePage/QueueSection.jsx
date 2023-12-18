import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SongItemQueue from "../Song/SongItemQueue";

const QueueSection = () => {
  const [songQueue, setSongQueue] = useState([]);
  const songQueueStore = useSelector((state) => state.music.songQueue);
  const playingSong = useSelector((state) => state.music.currentSong);
  console.log("QueueSection || playingSong", playingSong);

  useEffect(() => {
    if (songQueueStore != null) {
      setSongQueue(songQueueStore);
    }
    console.log("QueueSection || songQueueStore", songQueueStore);
  }, [songQueueStore]);

  return (
    <div
      className={`${
        songQueue != null && songQueue.length > 0 ? "min-h-screen" : "h-screen"
      } xl:p-6 bg-[#ecf2fd] mb-20`}
    >
      <div className="flex flex-row gap-4">
        <button
          onClick={() => window.history.back()}
          className="bg-[#2f9948] hover:bg-[#40cf62] rounded-md mb-5"
        >
          <div className="text-white font-bold px-2 py-1">{"<"} Back</div>
        </button>
      </div>
      <div className="text-4xl text-[#2d2c2c] font-bold text-start mb-5">
        Your Queue
      </div>

      <div className="text-2xl text-[#5d5c5c] font-bold text-start mt-10 mb-5">
        Now Playing
      </div>
      <SongItemQueue song={playingSong} isPlaying={true}></SongItemQueue>

      <div className="text-2xl text-[#5d5c5c] font-bold text-start mt-5 mb-5">
        Next Up
      </div>
      <div className="flex flex-col gap-1">
        {songQueue != null &&
          songQueue.map((song, index) => (
            <SongItemQueue
              key={song.id}
              order={index + 1}
              song={song}
              isPlaying={false}
            ></SongItemQueue>
          ))}
        {songQueue != null && songQueue.length === 0 && (
          <div className="text-center text-2xl font-bold text-[#5d5c5c] font-boldmt-5 mb-5">
            No song in queue!
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueSection;
