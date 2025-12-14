import Image from "next/image";
import Header from "./components/header/Header";
import { EditorialSlider } from "./components/section1/EditorialSlider";
import SoilHeader from "./components/Hero/SoilHeader";
import HeroSlider from "./components/Hero/HeroSlider";

export default function Home() {
  return (
    // <div>
    //   <h1>Welcome to the Test UI Home Page</h1>
    //   {/* <Header/> */}
    //   {/* <EditorialSlider/> */}
      
    // </div>

    <main className="min-h-screen w-full bg-white flex flex-col selection:bg-black selection:text-white">
      <SoilHeader />
      <HeroSlider />
    </main>
  );
}
