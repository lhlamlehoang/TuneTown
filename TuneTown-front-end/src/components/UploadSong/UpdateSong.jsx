/* eslint-disable react/prop-types */
import { useEffect, useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Button, Form, Input, Select, message } from "antd";
import { Base_URL } from "../../api/config";
import ArtistInput from "./ArtistInput";
import UseCookie from "../../hooks/useCookie";

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const UpdateSong = ({ songData }) => {
  const formRef = useRef(null);
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [uploadedFile, setUploadedFile] = useState({});
  const [fileIMG, setFileIMG] = useState();
  const [fileMP3, setFileMP3] = useState();
  const [form] = Form.useForm();

  //drop-zone
  const handleUploadFileIMG = async (file) => {
    let formData = new FormData();
    formData.append("image", file);
    console.log("handleUploadFile FileIMG", formData);
    message.open({
      type: "loading",
      content: "Uploading Image",
      duration: 1,
    });
    try {
      const response = await axios.post(
        `${Base_URL}/file/uploadImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status == 200) {
        console.log("Files posted successfully:", response.data);
        setFileIMG(response.data);
        message.open({
          type: "success",
          content: "Image Uploaded Successfully",
          duration: 2,
        });
      } else {
        console.error("Error posting files:", response.data);
      }
    } catch (error) {
      console.error("Error posting files:", error.message);
    }
  };
  const handleUploadFileMP3 = async (file) => {
    let formData = new FormData();
    formData.append("mp3File", file);
    console.log("handleUploadFile FileMP3", formData);
    message.open({
      type: "loading",
      content: "Uploading Song File",
      duration: 1,
    });
    try {
      const response = await axios.post(
        `${Base_URL}/file/uploadMp3`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status == 200) {
        console.log("Files posted successfully:", response.data);
        setFileMP3(response.data);
        message.open({
          type: "success",
          content: "Song File Uploaded Successfully",
          duration: 2,
        });
      } else {
        console.error("Error posting files:", response.data);
      }
    } catch (error) {
      console.error("Error posting files:", error.message);
    }
  };

  // Get Song from API
  const getSongById = async (songId) => {
    try {
      console.log("auth", access_token);
      const response = await axios.get(
        `${Base_URL}/songs/getSongById?songId=${songId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Post Song to API
  const updateSong = async (data) => {
    try {
      console.log("auth", access_token);
      const response = await axios.put(
        `${Base_URL}/songs?accessToken=${access_token}`,
        {
          id: data.id,
          songName: data.songName,
          poster: data.poster,
          songData: data.songData,
          genres: data.genre,
          status: 1,
          artists: data.artists.map((artist) => {
            return { id: artist };
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const onFinish = async (values) => {
    console.log("Received values:", values);
    const { songName, artists, genre } = values;
    if (artists == null) {
      message.error("Please select at least one artist");
      return;
    }
    if (fileIMG == null) {
      message.error("Please upload a cover image");
      return;
    }
    if (fileMP3 == null) {
      message.error("Please upload a song file");
      return;
    }
    const postData = {
      id: songData.songId,
      songName: songName,
      poster: fileIMG,
      songData: fileMP3,
      genres: genre,
      status: 1,
      artists: artists.map((artist) => {
        return { id: artist };
      }),
    };
    console.log("Posting Data", postData);
    // const artists = {};
    await updateSong(postData); // Call the function to post the song data
  };

  useEffect(() => {
    getSongById(songData.songId).then((data) => {
      console.log("songData", data);
      form.setFieldsValue({
        songName: data.songName,
        artists: data.artists.map((artist) => {
          return { value: artist.id, label: artist.userName };
        }),
        genre: data.genre,
        poster: data.poster,
        songData: data.songData,
      });
    });
  }, [songData.songId]);

  useEffect(() => {
    if (access_token == null) {
      console.log("CheckCookie", getToken());
      window.location.href = "/";
    }
  }, [access_token]);
  return (
    <section className="w-full h-full relative flex flex-col ">
      <Form
        {...layout}
        ref={formRef}
        name="control-ref"
        form={form}
        onFinish={onFinish}
        className="border rounded-md mx-auto p-5 bg-[#f9f9f9]"
      >
        <div className="w-full text-center mb-5">
          <h2 className="text-3xl uppercase font-monserrat font-bold text-[#312f2f]">
            Update Song
          </h2>
        </div>
        <Form.Item
          name="songName"
          label="Song Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <ArtistInput></ArtistInput>

        <Form.Item
          name="poster"
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
            handleUploadFile={handleUploadFileIMG}
            accept="image/jpeg, image/png"
          />
        </Form.Item>
        {/* MP3 File */}
        <Form.Item
          name="songData"
          label="Upload File"
          extra="Upload your audio file mp3, wav"
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
            handleUploadFile={handleUploadFileMP3}
            accept="audio/mp3"
          />
        </Form.Item>
        {/* Genre  */}
        <Form.Item
          name="genre"
          label="Song Genre"
          extra={"Select your song genre, CHOOSE ONE"}
        >
          <Select
            placeholder="Select a option and change input text above"
            allowClear
          >
            <Option value="Pop">Pop</Option>
            <Option value="Jazz">Jazz</Option>
            <Option value="EDM">EDM</Option>
            <Option value="Trap">Trap</Option>
            <Option value="other">other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.genre !== currentValues.genre
          }
        >
          {({ getFieldValue }) =>
            /* lấy giá trị trong field gender xem có phải other không */
            getFieldValue("genre") === "other" ? (
              /* Nếu chọn other thì hiện ra cái này */
              <Form.Item name="customizeGenre" label="Customize Genre">
                <Input />
              </Form.Item>
            ) : null
          }
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-[green] absolute right-2"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
};

// Use to upload File
function UploadFileDropZone(props) {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
        props.setUploadedFile(file);
      };
      reader.readAsArrayBuffer(file);
      props.handleUploadFile(file);
    });
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    onDrop,
    maxSize: 10485760,
    maxFiles: 1,
    accept:
      props.accept === "image/jpeg, image/png"
        ? {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
          }
        : props.accept === "audio/mp3"
        ? {
            "audio/mpeg": [".mp3"],
            "audio/wav": [".wav"],
            "audio/webm": [".webm"],
            "audio/flac": [".flac"],
            "audio/x-m4a": [".m4a"],
          }
        : undefined,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button
        type="button"
        onClick={open}
        variant="contained"
        className="border border-solid border-[#42ae49] bg-white hover:bg-[#42ae49] hover:text-white text-[#42ae49]"
        sx={{ width: "100%", height: 24 }}
      >
        Select file
      </Button>
    </div>
  );
}

export default UpdateSong;
