import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import Client_routes from "../../../routers/client.router/Client_routes";
import About from "../about/About";
import Blog from "../blog/Blog";
import Contact from "../contact/Contact";
import Home from "./Home";

function Home_Client() {
  return (
    <div
      className="scrollbar-hide"
      style={{
        backgroundImage:
          "linear-gradient( #c4c5c7 , #dcdddf 52%, #ebebeb 100%)",
      }}
    >
      <Navbar />
      <Client_routes />
      {/* <Home /> */}
      <Footer />
    </div>
  );
}

export default Home_Client;
