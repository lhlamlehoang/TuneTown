import axios from "axios";
import defaultAva from "../assets/img/logo/logo.png";
import { Base_URL } from "../api/config";
import UseCookie from "../hooks/useCookie";
import { useEffect, useState } from "react";
import { Form, Input, Modal, Space, Table, message } from "antd";
import UpdateSong from "../components/UploadSong/UpdateSong";

const CMSArtist = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const userId = localStorage.getItem("userId");
  const [refresh, setRefresh] = useState(false);
  const [artistDetail, setArtistDetail] = useState({});
  const [songListArtist, setSongListArtist] = useState([]);
  const [songData, setSongData] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
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
  const handleGetArtistDetail = async (artistId) => {
    await getArtistByArtistId(artistId).then((result) => {
      setArtistDetail(result);
      setSongListArtist(result.songs);
      console.log("SetArtistDetail", result);
      console.log("SetSongListArtist", songListArtist);
    });
  };
  const handSearch = (e) => {
    console.log("value", e.target.value);
    setSearchValue(e.target.value);
  };
  // Update Song
  const handUpdateSong = (songId, songName) => {
    const songData = {
      songId: songId,
      songName: songName,
    };
    setSongData(songData);
    setIsModalOpenUpdate(true);
  };

  const handleCancel = () => {
    setIsModalOpenUpdate(false);
  };

  // Delete Song
  const deleteSong = async (songId) => {
    try {
      if (confirm(`Are you sure you want to delete this song?`) == true) {
        console.log("auth", access_token);
        const response = await axios.delete(
          `${Base_URL}/songs/deleteSong?songId=${songId}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        if (response.status === 200) {
          message.success("Delete song successfully!");
        }
        // Refresh the component
        setRefresh(false);
        return response.status;
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const dataSongTable = songListArtist.map((songItem) => ({
    key: songItem.id.toString(), // Assuming id is unique
    poster: (
      <img
        src={songItem.poster}
        alt={songItem.songName}
        className="w-11 h-11 rounded-md"
      />
    ),
    songName: songItem.songName,
    artists: songItem.artists.map((artist) => artist.userName + " "), // Assuming artists is an array
    genres: songItem.genres.map((genre) => genre.genreName + " "), // Assuming genres is an array
    listens: songItem.listens,
    status: songItem.status,
  }));
  const columnsSong = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
      align: "center",
    },
    {
      title: "Poster",
      dataIndex: "poster",
      key: "poster",
      align: "center",
      render: (poster) => {
        return (
          <div className="flex items-center justify-center">
            <img
              src={poster.props.src ? poster.props.src : defaultAva}
              alt="poster"
              className="w-12 h-12 rounded-lg"
            />
          </div>
        );
      },
    },
    {
      title: "Song Name",
      dataIndex: "songName",
      key: "songName",
      align: "center",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Artist",
      dataIndex: "artists", // key in dataSongs
      key: "artists", // key in columnsSong
      align: "center",
      render: (artists) => {
        if (artists.length > 1) {
          return artists.map((artist, index) => (
            <div key={index}>{artist},</div>
          ));
        }
        return artists[0];
      },
    },
    {
      title: "Genres",
      dataIndex: "genres",
      key: "genres",
      align: "center",
    },
    {
      title: "Listens",
      dataIndex: "listens",
      key: "listens",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        if (status === 0) {
          return (
            <div className="flex justify-center items-center">
              <div
                className="
          bg-[#c42323e1] hover:bg-[#ea3f3f] text-white rounded-lg w-fit h-fit px-2 py-1
          "
              >
                Deleted
              </div>
            </div>
          );
        } else if (status === 1) {
          return (
            <div className="flex justify-center items-center">
              <div
                className="
          bg-[#2e9b42db] hover:bg-[#47c053] text-white rounded-lg w-fit h-fit px-2 py-1
          "
              >
                Public
              </div>
            </div>
          );
        }
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <button
            className="py-1 px-2 h-8 w-14  bg-[#2e9b42db] hover:bg-[#47c053] text-white rounded-lg"
            onClick={() => handUpdateSong(record.key, record.songName)}
          >
            Edit
          </button>
          <button
            className="py-1 px-2 h-8 w-14 bg-[#c42323e1] hover:bg-[#ea3f3f] text-white rounded-lg"
            onClick={() => deleteSong(record.key)}
          >
            Delete
          </button>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    if (localStorage.getItem("userRole") !== "ARTIST") {
      window.location.href = "/";
    }
  }, []);
  useEffect(() => {
    handleGetArtistDetail(userId).then(() => {
      setRefresh(true);
    });
  }, [userId, refresh]);
  return (
    <div className="h-full min-h-screen text-[#2E3271] bg-[#ecf2fd] pt-5 pb-24 px-1">
      {" "}
      <div className="flex flex-row">
        <div className="text-xl font-bold text-[#2E3271] my-5 mx-3">
          Good{" "}
          {new Date().getHours() < 12
            ? "Morning"
            : new Date().getHours() < 18
            ? "Afternoon"
            : "Evening"}
          {", "}
          {artistDetail.name ? artistDetail.name : "Unknown Artist"}
          {"! "}
        </div>
      </div>
      <div className="my-4">
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          layout="inline"
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >
          <Form.Item label="" name="songName" className="ml-1">
            <Input placeholder="Search Song" onChange={handSearch} />
          </Form.Item>
        </Form>
      </div>
      <Table
        columns={columnsSong}
        className="p-1"
        dataSource={
          searchValue
            ? dataSongTable.filter((song) =>
                song.songName.toLowerCase().includes(searchValue.toLowerCase())
              )
            : dataSongTable
        }
        // pagination={{
        //   total: totalPages,
        //   pageSize: 10,
        // }}
      />
      <Modal
        open={isModalOpenUpdate}
        onCancel={handleCancel}
        footer={[null, null]}
        className="w-fit h-fit "
      >
        <UpdateSong songData={songData}></UpdateSong>
      </Modal>
    </div>
  );
};

export default CMSArtist;
