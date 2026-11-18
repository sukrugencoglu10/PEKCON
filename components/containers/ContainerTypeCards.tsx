'use client';

import { useState, type ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';
import ContainerQuoteModal, { type ContainerModalItem } from './ContainerQuoteModal';

export type ContainerTypeCard = {
  icon: ReactNode;
  name: string;
  desc: string;
  image?: string;
  type?: string;
};

export default function ContainerTypeCards({ types, locale }: { types: ContainerTypeCard[]; locale: Locale }) {
  const [selected, setSelected] = useState<ContainerModalItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {types.map((t) => {
          const open = () =>
            setSelected({ name: t.name, image: t.image, type: t.type, desc: t.image ? undefined : t.desc });
          return (
            <div
              key={t.name}
              role="button"
              tabIndex={0}
              onClick={open}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  open();
                }
              }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-primary-300 transition-shadow p-5 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
                  {t.icon}
                </span>
                <h3 className="font-bold text-dark-900 text-lg">{t.name}</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{t.desc}</p>
            </div>
          );
        })}
      </div>

      <ContainerQuoteModal item={selected} onClose={() => setSelected(null)} locale={locale} />
    </>
  );
}
