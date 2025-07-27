import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../client.router/PrivateRoute";
import Blog from "../../pages/client/blog/Blog";
import Contact from "../../pages/client/contact/Contact";
import About from "../../pages/client/about/About";
import Home from "../../pages/client/home/Home";

type Routers = {
  id: number | string;
  path: string;
  Component: React.ComponentType;
};
function Client_routes() {
  const element: Routers[] = [
    {
      id: 1,
      path: "blog",
      Component: Blog,
    },
    {
      id: 2,
      path: "contact",
      Component: Contact,
    },
    {
      id: 3,
      path: "about",
      Component: About,
    },
    {
      id: 4,
      path: "",
      Component: Home,
    },
  ];
  return (
    <Routes>
      {element.map(({ id, path, Component }) => (
        <Route
          key={id}
          path={path}
          element={
            <PrivateRoute>
              <Component />
            </PrivateRoute>
          }
        />
      ))}
    </Routes>
  );
}

export default Client_routes;
