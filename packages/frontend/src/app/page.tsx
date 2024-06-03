import Image from "next/image";
import baseLogo from "../../public/base.png";
import ethLogo from "../../public/eth.png";
import avaxLogo from "../../public/avax.png";
import polygonLogo from "../../public/polygon.png";
import Link from "next/link";
import Stats from "./components/stats";

export default function Home() {
  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-2 text-zinc-100">
          Omnichain DEX:
        </h1>
        <h2 className="text-2xl md:text-4xl font-medium text-zinc-300">
          Discover the Best Exchange Rates Across All Chains
        </h2>
        <Stats />
        <Link href="/app" className="mt-8 mb-8 inline-block px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-300">
          Launch App
        </Link>
        <div className="flex justify-center items-center space-x-6 mt-10">
          <Image src={baseLogo} alt="Base Logo" width={50} height={50} />
          <Image src={ethLogo} alt="Ethereum Logo" width={50} height={50} />
          <Image src={avaxLogo} alt="Avalanche Logo" width={50} height={50} />
          <Image src={polygonLogo} alt="Polygon Logo" width={50} height={50} />
        </div>
      </div>
    </main>
  );
} 