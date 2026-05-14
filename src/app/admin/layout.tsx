import Header from "./components/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <div className="p-5 rounded-md">
        {children}
      </div>
    </div>
  );
}
