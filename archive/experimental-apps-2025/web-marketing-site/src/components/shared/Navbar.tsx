import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', color: 'radio' },
  { href: '/contacts', label: 'Contacts', color: 'press' },
  { href: '/campaigns', label: 'Campaigns', color: 'playlisting' },
  { href: '/analytics', label: 'Reports', color: 'influencer' },
  { href: '/integrations', label: 'Integrations', color: 'promo' },
];

export default function Navbar() {
  const router = useRouter();
  return (
    <nav className="w-full bg-white border-b-4 magazine-bg-alt shadow flex items-center justify-between px-6 py-2">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/assets/dog-logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <span className="font-space-grotesk text-xl font-bold text-campaign-radio">
          Total Audio Promo
        </span>
      </Link>
      <div className="flex gap-4">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1 rounded-md font-semibold transition-colors duration-200 text-gray-700 hover:text-white hover:bg-campaign-${
              link.color
            } ${router.pathname === link.href ? `bg-campaign-${link.color} text-white` : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
