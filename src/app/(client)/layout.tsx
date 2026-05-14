import Footer from "../../components/Footer";
import ActionBar from "../../components/ActionBar";
import Navbar from "../../components/Navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="scrollbar-hide"
      style={{
        backgroundImage:
          "linear-gradient( #c4c5c7 , #dcdddf 52%, #ebebeb 100%)",
      }}
    >
      <Navbar />
      <ActionBar />
      {children}
      <Footer />
    </div>
  );
}
