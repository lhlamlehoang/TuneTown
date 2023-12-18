import { Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Base_URL } from "../../api/config";
import UseCookie from "../../hooks/useCookie";
import axios from "axios";
import { Form } from "react-router-dom";

const UploadImage = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const UploadImage = async (values) => {
    try {
      const response = await axios.post(
        `${Base_URL}/songs/addSongFile`,
        values,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        // Handle success
        console.log("Poster posted successfully:", response.data);
      } else {
        // Handle other status codes
        console.error("Error posting poster:", response.statusText);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error posting poster:", error.message);
    }
  };
  const checkFileType = (file) => {
    const acceptedTypes = ["image/jpeg", "image/jpg"];
    const isJpg = acceptedTypes.includes(file.type);
    if (!isJpg) {
      message.error("Chỉ chấp nhận các tệp tin JPG/JPEG!");
    }
    return isJpg;
  };
  const customRequest = ({ file, onSuccess, onError }) => {
    UploadImage(file)
      .then(() => onSuccess())
      .catch((error) => {
        console.error("Error posting poster:", error);
        onError();
      });
  };

  const handleChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  return (
    <div>
      <Form.Item
        name="poster"
        label="Upload Cover Art"
        valuePropName="fileList"
        extra="Upload your cover image png, jpg, jpeg"
      >
        <Upload
          name="poster"
          action="/"
          listType="picture"
          customRequest={customRequest}
          beforeUpload={checkFileType}
          onChange={handleChange}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>
      {/* MP3 File */}
      <Form.Item
        name="songData"
        label="Upload File"
        valuePropName="fileList"
        extra="Upload your audio file mp3, wav"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Upload name="songData" action="/" listType="picture">
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>
    </div>
  );
};

export default UploadImage;
