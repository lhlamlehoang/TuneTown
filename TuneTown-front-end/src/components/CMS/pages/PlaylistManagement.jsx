/* eslint-disable no-unused-vars */
import { Form, Input, Modal, Space, Table } from "antd";
import UpdateSong from "../../UploadSong/UpdateSong";
import UploadSong from "../../UploadSong/UploadSong";
import { useEffect, useState } from "react";
import { Base_URL } from "../../../api/config";
import axios from "axios";
import UseCookie from "../../../hooks/useCookie";
import defaultAva from "../../../assets/img/logo/logo.png";

const PlaylistManagement = () => {
  const { getToken } = UseCookie();
  const [form] = Form.useForm();
  const { access_token } = getToken();
  const [songList, setSongList] = useState([]);
  const [songPage, setSongPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [refresh, setRefresh] = useState(false);
  const [songData, setSongData] = useState({});
  const [isModalOpenUpload, setIsModalOpenUpload] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);

  const refreshPlaylist = () => {
    setRefresh(!refresh);
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
      setSongList(songList);
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  // Update Song
  const handUpdateSong = (songId, songName) => {
    const songData = {
      songId: songId,
      songName: songName,
    };
    setIsModalOpenUpdate(true);
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
        // Refresh the component
        refreshPlaylist();
        return response.data;
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleOk = () => {
    form.submit();
    setIsModalOpenUpload(false);
  };
  const handleCancel = () => {
    setIsModalOpenUpload(false);
    setIsModalOpenUpdate(false);
  };

  // Song Data {id,artists, genres, listens, poster, songData, songName, status}
  // 0: {id: 3, songName: 'Out Of Time', poster: 'https://avatar-ex-swe.nixcdn.com/song/2022/01/07/2/5/8/e/1641534807286_640.jpg', artists: Array(1), genres: Array(0), …}
  // 1: {id: 5, songName: 'Starboy', poster: 'https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png', artists: Array(1), genres: Array(0), …}

  const columnsSong = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Poster",
      dataIndex: "poster",
      key: "poster",
      render: (poster) => {
        return poster.props.src ? (
          <img
            src={poster.props.src}
            alt="poster"
            className="w-12 h-12 rounded-lg"
          />
        ) : (
          <img src={defaultAva} alt="poster" className="w-12 h-12 rounded-lg" />
        );
      },
    },
    {
      title: "Song Name",
      dataIndex: "songName",
      key: "songName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Artist",
      dataIndex: "artists", // key in dataSongs
      key: "artists", // key in columnsSong
    },
    {
      title: "Genres",
      dataIndex: "genres",
      key: "genres",
    },
    {
      title: "Listens",
      dataIndex: "listens",
      key: "listens",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
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

  const dataSongs = songList.map((songItem) => ({
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
  console.log("dataSongs", dataSongs);
  useEffect(() => {
    getListSong(songPage);
  }, [isModalOpenUpload, isModalOpenUpdate]);
  const [searchValue, setSearchValue] = useState("");
  const handSearch = (e) => {
    console.log("value", e.target.value);
    setSearchValue(e.target.value);
  };
  if (!songList) return null;
  return (
    <div>
      <div className="text-2xl font-bold">Song Management</div>
      <div className=" flex flex-row justify-between mb-5 mt-5">
        <div className="">
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
            <Form.Item label="name" name="songName">
              <Input placeholder="Search Song" onChange={handSearch} />
            </Form.Item>
          </Form>
        </div>
      </div>
      <Table
        columns={columnsSong}
        dataSource={
          searchValue
            ? dataSongs.filter((song) =>
                song.songName.toLowerCase().includes(searchValue.toLowerCase())
              )
            : dataSongs
        }
        pagination={{
          total: totalPages,
          pageSize: 10,
          onChange: (page) => {
            getListSong(page);
          },
        }}
      />
      <Modal
        open={isModalOpenUpload}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[null, null]}
        className="w-fit h-fit "
      >
        <UploadSong></UploadSong>
      </Modal>
      <Modal
        open={isModalOpenUpdate}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[null, null]}
        className="w-fit h-fit "
      >
        <UpdateSong songData={songData}></UpdateSong>
      </Modal>
    </div>
  );
};

export default PlaylistManagement;
