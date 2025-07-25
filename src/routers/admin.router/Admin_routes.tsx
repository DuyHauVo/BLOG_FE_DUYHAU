import { Route, Routes } from "react-router-dom";
import Dashboard from "../../pages/admin/dashboard/Dashboard";
import Posts from "../../pages/admin/posts/Posts";
import Users from "../../pages/admin/users/Users";
import PrivateRoute from "../client.router/PrivateRoute";

type Routers = {
  id: number | string;
  path: string;
  Component: React.ComponentType;
};
function Admin_routes() {
  const element: Routers[] = [
    {
      id: 1,
      path: "/dashboard",
      Component: Dashboard,
    },
    {
      id: 2,
      path: "/user",
      Component: Users,
    },
    {
      id: 3,
      path: "/post",
      Component: Posts,
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

export default Admin_routes;
