import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/logo.png";

function Logo() {
  return (
    <Link href="/" className="bg-primary inline-block w-14 shrink-0 rounded-md">
      <Image
        src={logo}
        alt="Beloved Kindness Maxcare"
        sizes="56px"
        className="h-auto w-full"
      />
    </Link>
  );
}

export default Logo;
