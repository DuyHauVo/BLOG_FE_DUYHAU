import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../client.router/PrivateRoute";
import Home from "../../pages/client/home/Home";
import Blog from "../../pages/client/blog/Blog";
import Contact from "../../pages/client/contact/Contact";
import About from "../../pages/client/about/About";

type Routers = {
  id: number | string;
  path: string;
  Component: React.ComponentType;
};
function Client_routes() {
  const element: Routers[] = [
    {
      id: 1,
      path: "/",
      Component: Home,
    },
    {
      id: 2,
      path: "/blog",
      Component: Blog,
    },
    {
      id: 3,
      path: "/contact",
      Component: Contact,
    },
    {
      id: 4,
      path: "/about",
      Component: About,
    },
  ];
  return (
    <Routes>
      {element.map((element) => (
        <Route
          key={element.id}
          path={element.path}
          element={
            <PrivateRoute>
              <element.Component />
            </PrivateRoute>
          }
        />
      ))}
    </Routes>
  );
}

export default Client_routes;
