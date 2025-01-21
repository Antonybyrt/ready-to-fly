import { Title } from '@mantine/core';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import auth from '@/services/auth.service';
import { useRouter } from 'next/router';

const Header = () => {
  const [user, setUser] = useState<number | null>(); 
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await auth.getIdUser();
      if (user) {
        setUser(user);
      } else {
        router.push('../auth/logout');
      }
    };
    fetchUser();
  }, [user]);

  return (
    <header className="w-full bg-blue-950 p-4 text-white flex justify-between items-center">
      <div className="flex items-center">
        <Image
          src="/corsair.png"
          alt="Logo"
          width={80}
          height={80}
          className="mr-2"
        />
        <Link href="/dashboard">
          <Title order={1} className="text-2xl font-bold font-sans hover:text-pink-500">READY TO FLY</Title>
        </Link>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/newFlight">
              <p className="px-2 py-1 text-white border-2 border-transparent rounded-3xl text-lg hover:text-pink-500 transition-colors">
                New Flight
              </p>
            </Link>
          </li>
          <li>
            <Link href="/myFlights">
              <p className="px-2 py-1 text-white border-2 border-transparent rounded-3xl text-lg  hover:text-pink-500 transition-colors">
                My Flights
              </p>
            </Link>
          </li>
          <li>
            <Link href="../auth/logout">
              <p className="px-2 py-1 bg-pink-400 text-white border-2 border-pink-400 rounded-3xl text-lg hover:bg-pink-500 hover:border-pink-500 transition-colors">
                Log out
              </p>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
