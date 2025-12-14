import Image from "next/image";
import Header from "./components/header/Header";
import { EditorialSlider } from "./components/section1/EditorialSlider";

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Test UI Home Page</h1>
      {/* <Header/> */}
      <EditorialSlider/>
    </div>
  );
}
