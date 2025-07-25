import Admin_routes from "../../../routers/admin.router/Admin_routes";
import Header from "../layouts/Header";

function Home() {
  return (
    <div>
      <Header />
      <div className="p-5 rounded-md">
        <Admin_routes />
      </div>
    </div>
  );
}

export default Home;
