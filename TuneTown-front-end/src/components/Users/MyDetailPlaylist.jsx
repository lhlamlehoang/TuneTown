import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Modal, Select } from "antd";
import { useDataAPI, useMusicAPI } from "../../utils/songUtils";
import MySongSectionPlaylist from "./MySongSectionPlaylist";
import { useDispatch, useSelector } from "react-redux";
import { setRefreshPlaylist } from "../../redux/slice/playlist";
import UploadFileDropZone from "../UploadSong/UploadFileDropZone";

const MyDetailPlaylist = () => {
  //http://localhost:8080/playlists/getPlaylistSongs?playlistId=102
  const { playlistId } = useParams();
  const [form] = Form.useForm();
  const { editPlaylist, getListSongPlaylist, getPlaylistByPlaylistId } =
    useMusicAPI();
  const dispatch = useDispatch();
  const { handleUploadFileIMG } = useDataAPI();
  const [songPlaylistList, setSongPlaylistList] = useState();
  const [playlistDetail, setPlaylistDetail] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState({});
  const [coverArt, setCoverArt] = useState();
  const refreshPlaylist = useSelector(
    (state) => state.playlist.refreshPlaylist
  );

  // Get data from API and set for Edit Modal
  const fetchDataPlaylistInfor = async (playlistId) => {
    // Fetch data from API and set for Edit Modal
    const detailData = await getPlaylistByPlaylistId(playlistId);
    if (detailData) {
      setPlaylistDetail(detailData);
      const { playlistName, playlistType, coverArt } = detailData;
      form.setFieldsValue({
        playlistName,
        playlistType,
        baseAva: coverArt,
      });
    }
    // Fetch data from API and set for SongList
    const data = await getListSongPlaylist(playlistId);
    if (data) {
      setSongPlaylistList(data);
      console.log("GetListSong in Playlist", data);
    }
    dispatch(setRefreshPlaylist(false));
  };

  // Edit Playlist API
  const handleOnclickEditForm = async (
    playlistId,
    playlistName,
    playlistType,
    coverArt
  ) => {
    await editPlaylist(playlistId, playlistName, playlistType, coverArt).then(
      () => {
        fetchDataPlaylistInfor(playlistId);
        dispatch(setRefreshPlaylist(true));
      }
    );
    setModalOpen(false);
  };

  // Reload data when refreshPlaylist is changed
  useEffect(() => {
    fetchDataPlaylistInfor(playlistId);
    if (refreshPlaylist == true) fetchDataPlaylistInfor(playlistId);
  }, [playlistId, refreshPlaylist]);

  // Set new baseAva when uploadedFile is changed
  useEffect(() => {
    if (uploadedFile) {
      form.setFieldsValue({
        baseAva: uploadedFile,
      });
    }
  }, [uploadedFile]);
  return (
    <div
      className={`${
        songPlaylistList != null && songPlaylistList.length > 0
          ? "min-h-screen h-full"
          : "min-h-screen"
      } xl:p-5 bg-[#ecf2fd] mb-20`}
    >
      {/* Button  */}
      <div className="flex flex-row gap-4">
        <button
          onClick={() => window.history.back()}
          className="bg-[#2f9948] hover:bg-[#40cf62] rounded-md mb-5"
        >
          <div className="text-white font-bold px-2 py-1">{"<"} Back</div>
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#ecf2fd] text-[#40cf62] hover:text-[#ecf2fd]  hover:bg-[#40cf62] border border-solid border-[#40cf62]  rounded-md mb-5"
        >
          <div className="font-bold px-2 py-1">Edit Playlist Information</div>
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

      <MySongSectionPlaylist
        playlistId={playlistId}
        songData={songPlaylistList}
      ></MySongSectionPlaylist>

      <Modal
        title="Options"
        centered
        open={modalOpen}
        okButtonProps={{ style: { backgroundColor: "#45cc79" } }}
        onOk={() =>
          handleOnclickEditForm(
            playlistId,
            form.getFieldValue("playlistName"),
            form.getFieldValue("playlistType"),
            coverArt
          )
        }
        onCancel={() => setModalOpen(false)}
        className="text-[#359254] "
      >
        <Form
          form={form}
          centered
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            name="playlistName"
            label="Playlist Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="playlistType" label="Playlist Privacy">
            <Select
              placeholder="Select one option..."
              options={[
                { value: "Public", label: "Public" },
                { value: "Private", label: "Private" },
              ]}
            ></Select>
          </Form.Item>
          <div className="flex flex-col gap-2">
            <Form.Item name="baseAva">
              <img
                className="ml-10 w-40 h-40 rounded-md"
                src={
                  playlistDetail.coverArt
                    ? playlistDetail.coverArt
                    : "https://i.pinimg.com/550x/f8/87/a6/f887a654bf5d47425c7aa5240239dca6.jpg"
                }
                alt=""
              />
            </Form.Item>
            <Form.Item
              name="coverArt"
              label="Upload Cover Art"
              extra="Upload your cover image png, jpg, jpeg"
              getValueFromEvent={(e) => e && e.fileList}
              valuePropName="fileList"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <UploadFileDropZone
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
                handleUploadFile={(uploadedFile) =>
                  handleUploadFileIMG(uploadedFile).then((res) =>
                    setCoverArt(res)
                  )
                }
                accept="image/jpeg, image/png"
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default MyDetailPlaylist;
