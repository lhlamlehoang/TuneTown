import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types, no-unused-vars
const MyPlaylistItem = ({ id, playlistName, playlistType, coverArt }) => {
  const navigate = useNavigate();

  return (
    <div
      className="w-fit h-fit border-[1px] rounded-lg border-solid border-[#4cd658] bg-white hover:bg-slate-200 cursor-pointer"
      onClick={() => {
        navigate(`/mydetail/${id}`);
        localStorage.setItem("myPlaylistId", id);
      }}
    >
      <div className="xl:w-fit xl:h-fit pb-3 w-fit h-fit rounded-lg bg-transparent">
        <img
          className="ml-[13px] xl:ml-[15px] mt-[15px] mr-[15px] xl:w-[150px] xl:h-[150px] w-[102px] h-[90px] rounded-lg object-cover"
          alt="Album cover"
          src={
            coverArt
              ? coverArt
              : `https://i.pinimg.com/550x/f8/87/a6/f887a654bf5d47425c7aa5240239dca6.jpg`
          }
        />
        <div className="ml-[13px] xl:ml-[15px] mt-[12px] text-[#2E3271] font-bold text-lg">
          {playlistName}
        </div>
        <div className="ml-[13px] xl:ml-[15px] mt-1 text-[#6d7da1bf]">
          {playlistType} <span className="text-[#b1bfe0bf]">#{id}</span>
        </div>
      </div>
    </div>
  );
};

export default MyPlaylistItem;
