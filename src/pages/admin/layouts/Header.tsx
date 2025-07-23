function Header() {
  return (
    <div
      className=""
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <h1 className="text-2xl font-bold">MANAGER SIMPLE BLOG</h1>
      <div>
        <ul className="flex gap-5">
          <li>Dashboard</li>
          <li>User</li>
          <li>Post</li>
        </ul>
      </div>
    </div>
  );
}

export default Header;
