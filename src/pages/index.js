import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push('/Moon'); // Redirect to the '/about' page
  }, []);


  return (
    <>
      <Link href="/Moon">
        Moon
      </Link>
    </>
  );
}
