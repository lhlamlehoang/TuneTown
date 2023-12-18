import { Form, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Base_URL } from "../../api/config";
import useDebounce from "../../hooks/useDebounce";
import UseCookie from "../../hooks/useCookie";

const GenreInput = () => {
  // Get the users name from API
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [genreNameRS, setGenreNameRS] = useState([]);
  const [genreRS, setGenreRS] = useState([]); // [{id:"",name: "", email: ""}]
  const [genreNameInput, setGenreNameInput] = useState("");
  const inputDebounce = useDebounce(genreNameInput, 500);

  // Genre Name Input
  const handleGenreNameChange = (value) => {
    setGenreNameInput(value);
  };

  // Get Genre from API
  const getGenre = async () => {
    try {
      const response = await axios.get(`${Base_URL}/songs/getAllGenres`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response.data;
      // return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    if (inputDebounce) {
      getGenre().then((response) => {
        response.forEach((genre) => {
          if (genre.id != null && genre.genreName != null) {
            if (
              !genreRS.includes(genre) &&
              !genreNameRS.includes(genre.genreName)
            ) {
              setGenreNameRS((prevGenreNames) => [
                ...prevGenreNames,
                genre.genreName,
              ]);
              setGenreRS((prevGenres) => [
                ...prevGenres,
                { id: genre.id, genreName: genre.genreName },
              ]);
            }
          }
        });

        console.log("GenreRS", genreRS);
        console.log("genreNameRS", genreNameRS);
      });
    }
  }, [inputDebounce]);
  return (
    <Form.Item
      name="genres"
      label="Song Genres"
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
        placeholder="Select Genre Name"
        optionFilterProp="children"
        // onChange={handleEmailChange}
        onSearch={handleGenreNameChange}
        filterOption={filterOption}
        options={genreRS.map((genre) => {
          console.log("genre", genre);
          return { id: genre.id, value: genre.id, label: genre.genreName };
        })}
      />
    </Form.Item>
  );
};

export default GenreInput;
