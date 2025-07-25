import Navbar from "../../../components/Navbar";
import Client_routes from "../../../routers/client.router/Client_routes";

function Home() {
  return (
    <div>
      <Navbar />
      <Client_routes />
    </div>
  );
}

export default Home;
