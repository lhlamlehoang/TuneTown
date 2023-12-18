/* eslint-disable no-unused-vars */
import { Form, Input } from "antd";
import { useEffect, useState } from "react";
import { Base_URL } from "../api/config";
import axios from "axios";
import UseCookie from "../hooks/useCookie";
import { useForm } from "antd/es/form/Form";
import SongItemSearch from "../components/Song/SongItemSearch";
import useDebounce from "../hooks/useDebounce";

const SearchPage = () => {
  const { getToken } = UseCookie();
  const { access_token } = getToken();
  const [form] = useForm();
  const [artistRs, setArtistRs] = useState([]);
  const [songRs, setSongRs] = useState([]);
  const [keywordsInput, setKeywordsInput] = useState("");
  const keywordsInputDebounce = useDebounce(keywordsInput, 500);
  // Search Song by name http://localhost:8080/songs/findSong?name=A
  const searchSongByName = async (keywords) => {
    try {
      const response = await axios.post(
        `${Base_URL}/songs/findSong?name=${keywords}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error edited user:", error.message);
    }
  };
  const searchArtistByName = async (keywords) => {
    try {
      const response = await axios.post(
        `${Base_URL}/songs/findSong?name=${keywords}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error edited user:", error.message);
    }
  };
  const handleSearch = async (keywords) => {
    console.log("SearchPage || handleSearchSong", keywords);
    // Checkk if keywords is empty
    if (keywords === "") return;
    // Search Song
    const searchSong = await searchSongByName(keywords);
    console.log("SearchSong || Song Result", searchSong);
    if (searchSong.length === 0) return;
    else {
      setSongRs(searchSong);
    }
    // Search Artist
    const searchArtist = await searchArtistByName(keywords);
    console.log("SearchArtist || Artist Result", searchArtist);
    if (searchArtist.length === 0) return;
    else {
      setArtistRs(searchArtist);
    }
  };

  useEffect(() => {
    console.log("SearchPage || keywordsInput", keywordsInput);
    if (keywordsInputDebounce === "") {
      setSongRs(null);
      setArtistRs(null);
    }
    if (keywordsInputDebounce) {
      handleSearch(keywordsInputDebounce);
    }
  }, [keywordsInputDebounce]);
  return (
    <div className="text-white bg-[#ecf2fd] min-h-screen pt-16 px-5">
      <Form className="flex flex-col justify-center" form={form}>
        <Form.Item
          name="search"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input
            name="keywords"
            placeholder="Search..."
            onChange={(e) => setKeywordsInput(e.target.value)}
            className="rounded-md bg-[#FFFFFFCC] w-full h-14 text-lg"
          />
        </Form.Item>
      </Form>
      {songRs != null && (
        <div className="bg-[#FFFFFFCC] rounded-xl m-auto ml-2 mr-2 mt-2 pt-5 pl-5 pr-5 pb-5">
          {songRs.map((song, index) => (
            <SongItemSearch key={song.id} songOrder={index + 1} song={song} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
