import "swiper/scss";
import "react-contexify/dist/ReactContexify.css";
import { RouterProvider } from "react-router-dom";
import router from "./routers/router";
function App() {
  return (
    // <Fragment>
    //   <BrowserRouter>
    //     <Routes>
    //       <Route path="/login" element={<LoginPage />}></Route>
    //       <Route path="/signup" element={<SignUpPage />}></Route>
    //       <Route path="/" element={<PageFull />}>
    //         <Route path="/" element={<HomePage />}></Route>
    //         <Route path="/search" element={<SearchPage />}></Route>
    //         <Route path="/playlist" element={<PlaylistPage />}></Route>
    //       </Route>
    //     </Routes>
    //   </BrowserRouter>
    // </Fragment>
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
