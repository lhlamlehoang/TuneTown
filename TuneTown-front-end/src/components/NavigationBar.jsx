import { NavLink, useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const navigate = useNavigate();
  return (
    <div>
      {/* Navigation Laptop  */}
      <div className=" hidden xl:flex h-screen bg-[#FFFFFFCC] justify-center ">
        <div className="max-xl:w-64 xl:fixed">
          <div
            className="text-center pt-6 uppercase font-bold text-lg flex flex-row justify-center items-center gap-5 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <div>
              <img
                src="src\assets\img\logo\logo.png"
                className="h-12 rounded-lg"
                alt=""
              />
            </div>
            <div className="text-[#2E3271]">TuneTown</div>
          </div>
          <div className="mt-8">
            <div className="flex flex-col mt-7 gap-2">
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  isActive
                    ? "h-10 w-48 bg-gradient-to-r from-[#6aca72] to-[#32b95b] font-bold hover:text-[#e9e5e5] text-white flex justify-center items-center rounded-lg"
                    : "h-10 w-48 font-bold hover:text-[#6aca72] text-[#2E327180] flex justify-center items-center rounded-lg"
                }
              >
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                  </svg>
                </span>
                Home
              </NavLink>
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  isActive
                    ? "h-10 w-48 bg-gradient-to-r from-[#6aca72] font-bold to-[#32b95b] hover:text-[#e9e5e5] text-white flex justify-center items-center rounded-lg"
                    : "h-10 w-48 font-bold hover:text-[#6aca72] text-[#2E327180] flex justify-center items-center rounded-lg"
                }
              >
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Search
              </NavLink>
              <NavLink
                to="/playlist"
                className={({ isActive }) =>
                  isActive
                    ? "h-10 w-48 bg-gradient-to-r from-[#6aca72] to-[#32b95b] font-bold hover:text-[#e9e5e5] text-white flex justify-center items-center rounded-lg"
                    : "h-10 w-48 hover:text-[#6aca72] font-bold text-[#2E327180] flex justify-center items-center rounded-lg"
                }
              >
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M15 3.75H9v16.5h6V3.75zM16.5 20.25h3.375c1.035 0 1.875-.84 1.875-1.875V5.625c0-1.036-.84-1.875-1.875-1.875H16.5v16.5zM4.125 3.75H7.5v16.5H4.125a1.875 1.875 0 01-1.875-1.875V5.625c0-1.036.84-1.875 1.875-1.875z" />
                  </svg>
                </span>
                My Playlists
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Mobile  */}
      <div className=" flex flex-row xl:hidden bg-[#ffffff] fixed bottom-0 z-50 w-screen justify-center">
        <div className="">
          <div className="py-1">
            <div className="flex flex-row items-center justify-center gap-4">
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  isActive
                    ? "h-2 w-auto p-4 bg-gradient-to-r from-[#6aca72] to-[#32b95b] font-bold hover:text-[#e9e5e5] text-[#fff] flex justify-center items-center rounded-lg"
                    : "h-2 w-auto p-4 font-bold hover:text-[#6aca72] text-[#2E327180] flex justify-center items-center rounded-lg"
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  isActive
                    ? "h-2 w-auto p-4 bg-gradient-to-r from-[#6aca72] to-[#32b95b] font-bold hover:text-[#e9e5e5] text-[#fff] flex justify-center items-center rounded-lg"
                    : "h-2 w-auto p-4 font-bold hover:text-[#6aca72] text-[#2E327180] flex justify-center items-center rounded-lg"
                }
              >
                Search
              </NavLink>
              <NavLink
                to="/playlist"
                className={({ isActive }) =>
                  isActive
                    ? "h-2 w-auto p-4 bg-gradient-to-r from-[#6aca72] to-[#32b95b] font-bold hover:text-[#e9e5e5] text-[#fff] flex justify-center items-center rounded-lg"
                    : "h-2 w-auto p-4 font-bold hover:text-[#6aca72] text-[#2E327180] flex justify-center items-center rounded-lg"
                }
              >
                Playlists
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
