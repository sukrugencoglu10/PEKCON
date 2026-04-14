'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function FooterLogo() {
  const router = useRouter();

  return (
    <Image
      src="/SVGpekcon_x.svg"
      alt="PEKCON Container & Logistics"
      width={160}
      height={50}
      className="mb-4 h-auto w-40 cursor-default select-none"
      onDoubleClick={() => router.push('/admin')}
      draggable={false}
    />
  );
}
