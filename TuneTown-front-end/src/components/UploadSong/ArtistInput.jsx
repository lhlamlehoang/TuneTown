import { Form, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Base_URL } from "../../api/config";
import useDebounce from "../../hooks/useDebounce";
import UseCookie from "../../hooks/useCookie";

const ArtistInput = () => {
  // Get the users name from API
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [emailRS, setEmailRS] = useState([]);
  const [artistRS, setArtistRS] = useState([]); // [{id:"",name: "", email: ""}]
  const [emailInput, setEmailInput] = useState("");
  const inputDebounce = useDebounce(emailInput, 500);
  const handleEmailChange = (value) => {
    // setEmailInput(e.target.value);
    setEmailInput(value);
  };
  const getArtist = async (emailInput) => {
    try {
      const response = await axios.get(`${Base_URL}/users/getUsers`, {
        params: {
          email: emailInput,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response.data.filter((user) => user.role === "ARTIST");
      // return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    console.log("emailInput", emailInput);
    if (inputDebounce === "") {
      setEmailRS([]);
      setArtistRS([]);
    } else if (inputDebounce !== "") {
      getArtist(emailInput).then((response) => {
        response.forEach((user) => {
          // Check if email existed and email not changed
          if (user.id != null && user.email != null && user.userName != null) {
            if (!artistRS.includes(user) && !emailRS.includes(user.email)) {
              setEmailRS((prevEmails) => [...prevEmails, user.email]);
              setArtistRS((prevArtists) => [
                ...prevArtists,
                { id: user.id, name: user.userName, email: user.email },
              ]);
            }
          }
        });

        console.log("ArtistRS", artistRS);
        console.log("emailRS", emailRS);
      });
    }
  }, [emailInput, inputDebounce]);

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  return (
    <Form.Item
      name="artists"
      label="Song Artist"
      rules={[
        {
          required: true,
        },
      ]}
    >
      {/* <Input onChange={handleEmailChange} /> */}
      <Select
        showSearch
        mode="multiple"
        placeholder="Select Artist Email"
        optionFilterProp="children"
        // onChange={handleEmailChange}
        onSearch={handleEmailChange}
        filterOption={filterOption}
        options={artistRS.map((artist) => {
          console.log("artist", artist);
          return { id: artist.id, value: artist.id, label: artist.email };
        })}
      />
    </Form.Item>
  );
};

export default ArtistInput;
