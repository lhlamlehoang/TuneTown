/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Base_URL } from "../../api/config";
import axios from "axios";
import UseCookie from "../../hooks/useCookie";

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

    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
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

const UploadAvatar = ({ setFileIMG }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [uploadedFile, setUploadedFile] = useState({});
  //drop-zone
  const handleUploadFileIMG = async (file) => {
    let formData = new FormData();
    formData.append("image", file);
    console.log("handleUploadFile FileIMG", formData);
    messageApi.open({
      type: "loading",
      content: "Uploading file...",
      duration: 2,
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
        messageApi.open({
          type: "success",
          content: "Upload file successfully",
          duration: 2,
        });
      } else {
        console.error("Error posting files:", response.data);
      }
    } catch (error) {
      console.error("Error posting files:", error.message);
    }
  };
  return (
    <UploadFileDropZone
      uploadedFile={uploadedFile}
      setUploadedFile={setUploadedFile}
      handleUploadFile={handleUploadFileIMG}
    >
      {contextHolder}
    </UploadFileDropZone>
  );
};

export default UploadAvatar;
