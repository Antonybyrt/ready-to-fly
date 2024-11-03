import { Title } from '@mantine/core';
import Link from 'next/link';
import Image from 'next/image'; // Importer le composant Image

const Header = () => {
  return (
    <header className="w-full bg-blue-600 p-4 text-white flex justify-between items-center">
      <div className="flex items-center">
        <Image 
          src="/corsair.png"
          alt="Logo"
          width={80}
          height={80}
          className="mr-2"
        />
        <Link href="/">
            <Title order={1} className="text-2xl font-bold">READY TO FLY</Title>
        </Link>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/newFlight">
              <p className="text-lg hover:text-blue-300">New Flight</p>
            </Link>
          </li>
          <li>
            <Link href="/myFlights">
              <p className="text-lg hover:text-blue-300">My Flights</p>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
