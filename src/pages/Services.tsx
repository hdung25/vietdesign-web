import { useLang } from '../contexts/LanguageContext';

function ServiceItem({
  imgSrc,
  imgAlt,
  titleKey,
  descKey,
  items,
  reverse = false,
}: {
  imgSrc: string;
  imgAlt: string;
  titleKey: string;
  descKey: string;
  items: string[];
  reverse?: boolean;
}) {
  const { t } = useLang();
  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-16 items-center`}>
      <div className="w-full md:w-1/2">
        <div className="aspect-square overflow-hidden">
          <img alt={imgAlt} className="w-full h-full object-cover" src={imgSrc} referrerPolicy="no-referrer" />
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <h2 className="font-headline text-5xl md:text-6xl text-[#d2b06f] mb-6">{t(titleKey)}</h2>
        <p className="text-on-surface-variant text-xl leading-relaxed mb-8">{t(descKey)}</p>
        <ul className="space-y-4 text-on-surface-variant font-light text-xl leading-relaxed">
          {items.map(key => (
            <li key={key} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-[#d2b06f] rounded-full flex-shrink-0"></span>
              {t(key)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Services() {
  const { t } = useLang();

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-10">
        <div className="mb-20">
          <p className="text-[#d2b06f] font-medium tracking-[0.4em] uppercase text-2xl md:text-3xl mb-4">{t('services.label')}</p>
          <h1 className="font-headline text-7xl md:text-8xl lg:text-9xl text-white tracking-tight">{t('services.title')}</h1>
        </div>

        <div className="space-y-32">
          <ServiceItem
            imgSrc="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=85&fit=crop"
            imgAlt="Architectural Design"
            titleKey="services.s1.title"
            descKey="services.s1.desc"
            items={['services.s1.li1', 'services.s1.li2', 'services.s1.li3', 'services.s1.li4']}
          />
          <ServiceItem
            imgSrc="https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=900&q=85&fit=crop"
            imgAlt="Interior Design"
            titleKey="services.s2.title"
            descKey="services.s2.desc"
            items={['services.s2.li1', 'services.s2.li2', 'services.s2.li3', 'services.s2.li4']}
            reverse
          />
          <ServiceItem
            imgSrc="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=900&q=85&fit=crop"
            imgAlt="Construction"
            titleKey="services.s3.title"
            descKey="services.s3.desc"
            items={['services.s3.li1', 'services.s3.li2', 'services.s3.li3', 'services.s3.li4']}
          />
        </div>
      </div>
    </div>
  );
}
