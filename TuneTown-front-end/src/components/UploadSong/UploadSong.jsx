/* eslint-disable react/prop-types */
import React, { useEffect, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Button, Form, Input, message } from "antd";
import { Base_URL } from "../../api/config";
import ArtistInput from "./ArtistInput";
import GenreInput from "./GenreInput";
import UseCookie from "../../hooks/useCookie";

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

const UploadSong = () => {
  const formRef = React.useRef(null);
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [uploadedFile, setUploadedFile] = useState({});
  const [fileIMG, setFileIMG] = useState();
  const [fileMP3, setFileMP3] = useState();

  //drop-zone
  const handleUploadFileIMG = async (file) => {
    let formData = new FormData();
    formData.append("image", file);
    console.log("handleUploadFile FileIMG", formData);
    message.loading("Uploading Image", 1);
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
        message.success("Image Uploaded Successfully", 2);
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
  // Post Song to API
  const postSong = async (values) => {
    try {
      const response = await axios.post(`${Base_URL}/songs/addSong`, values, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          // Add any other headers if required
        },
      });
      if (response.status === 200) {
        // Handle success
        console.log("Song posted successfully:", response.data);
        message.success("Song posted successfully");
        formRef.current.resetFields();
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error posting song:", error.message);
      message.error("Error posting song:", error.message);
    }
  };
  const onFinish = async (values) => {
    console.log("Received values:", values);
    const { songName, artists, genres } = values;
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
      songName: songName,
      poster: fileIMG,
      songData: fileMP3,
      genres: genres.map((item) => {
        return { id: item };
      }),
      status: 1,
      artists: artists.map((artist) => {
        return { id: artist };
      }),
    };
    console.log("Posting Data", postData);
    // const artists = {};
    await postSong(postData); // Call the function to post the song data
  };

  useEffect(() => {
    if (access_token == null) {
      console.log("CheckCookie", getToken());
      window.location.href = "/";
    }
  }, [access_token]);
  return (
    <Form
      {...layout}
      ref={formRef}
      name="control-ref"
      onFinish={onFinish}
      className="border rounded-md mx-auto p-5 bg-[#f9f9f9]"
    >
      <div className="w-full text-center mb-5">
        <h2 className="text-3xl uppercase font-monserrat font-bold text-[#312f2f]">
          Upload Your Masterpiece
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
        extra="Upload your audio file mp3, wav. Please wait for the file to be uploaded before submitting."
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
      <GenreInput></GenreInput>

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

export default UploadSong;
