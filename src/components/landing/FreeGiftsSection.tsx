import {
  Sparkles,
  Moon,
  Brush,
  BookOpen,
  BookText,
  MessageCircle,
  ShieldCheck,
  Check,
  Gift,
} from 'lucide-react';

const BASE_PATH = (import.meta as any).env?.BASE_URL || '/';

const green = '#0f3d2e';
const gold = '#facc15';
const red = '#d82726';

const giftItems = [
  {
    number: '01',
    title: 'ITCH-NO-MORE Dandruff Cream',
    sub: '5g',
    text: 'Soothe itching and fight flakes before they build up.',
    icon: Sparkles,
    image: `${BASE_PATH}assets/sample-itchnomore.png`,
  },
  {
    number: '02',
    title: 'Premium Satin Bonnet',
    sub: '1',
    text: 'Protect your strands while you sleep.',
    icon: Moon,
    image: `${BASE_PATH}assets/bonnet.jpg`,
  },
  {
    number: '03',
    title: 'Detangling Brush',
    sub: '1',
    text: 'Glide through knots without snapping your hair.',
    icon: Brush,
    image: `${BASE_PATH}assets/hairbrush.webp`,
  },
  {
    number: '04',
    title: 'The 7 Major Things E-Book Guide',
    sub: '',
    text: 'The 7 Major Things I Did to Grow My Hair 22 Inches + How You Can Too!\nBy H. Nasir — The Fulani Hair Gro',
    icon: BookOpen,
    image: `${BASE_PATH}assets/book.png`,
  },
  {
    number: '05',
    title: 'Healthy Hair Habits Guide',
    sub: '',
    text: 'A simple daily routine you can stick to.',
    icon: BookText,
    image: `${BASE_PATH}assets/book2.png`,
  },
  {
    number: '06',
    title: '30-Day WhatsApp Support',
    sub: '',
    text: 'Direct help while you use your products.',
    icon: MessageCircle,
    image: `${BASE_PATH}assets/book3.png`,
  },
  {
    number: '07',
    title: '30-Day Results Guarantee',
    sub: '',
    text: 'Try it risk-free for 30 full days.',
    icon: ShieldCheck,
    image: `${BASE_PATH}assets/book4.png`,
  },
];

const trustItems = [
  'Pay on Delivery',
  'Nationwide Delivery',
  '30-Day Results Guarantee',
  'WhatsApp Support',
];

function GiftImage({ src, Icon }: { src: string; Icon: typeof Sparkles }) {
  return (
    <div
      className="relative w-full h-80 md:h-60 mx-auto mb-4 rounded-2xl flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#fffbeb', border: `2px solid ${gold}` }}
    >
      <img
        src={src}
        alt=""
        className="absolute inset-0 w-full h-full object-contain p-2 hidden gift-img"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = 'flex';
        }}
        onLoad={(e) => {
          (e.currentTarget as HTMLImageElement).classList.remove('hidden');
          const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = 'none';
        }}
      />
      <span
        className="w-full h-full flex items-center justify-center gift-fallback"
        style={{ color: green }}
      >
        <Icon className="w-20 h-20 md:w-24 md:h-24" strokeWidth={1.5} />
      </span>
    </div>
  );
}

function GiftCard({
  gift,
  className = '',
}: {
  gift: (typeof giftItems)[number];
  className?: string;
}) {
  const Icon = gift.icon;
  return (
    <div
      className={[
        'rounded-2xl p-4 text-center flex flex-col justify-between shadow-lg w-[94%] md:w-full bg-white',
        className,
      ].join(' ')}
      style={{ border: `2px solid ${gold}` }}
    >
      <div>
        <span
          className="inline-block w-7 h-7 md:w-8 md:h-8 rounded-full text-white font-black text-sm md:text-base leading-7 md:leading-8 mb-2"
          style={{ backgroundColor: red }}
        >
          {gift.number}
        </span>
        <GiftImage src={gift.image} Icon={Icon} />
        <h4
          className="font-black text-lg md:text-base leading-tight mb-1"
          style={{ color: green }}
        >
          {gift.title}
        </h4>
        {gift.sub && (
          <p
            className="font-bold text-sm md:text-sm mb-1"
            style={{ color: red }}
          >
            {gift.sub}
          </p>
        )}
        <p className="text-gray-700 text-sm md:text-sm whitespace-pre-line leading-relaxed">
          {gift.text}
        </p>
      </div>
    </div>
  );
}

export default function FreeGiftsSection() {
  const scrollToOrder = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = '#order-form';
    }
  };

  return (
    <section
      className="w-full py-12 md:py-20 px-4"
      style={{ backgroundColor: green }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Main heading */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 mb-3" style={{ color: gold }}>
            <Gift className="w-6 h-6 md:w-8 md:h-8" />
            <span className="uppercase font-bold tracking-widest text-sm md:text-base">
              Limited Time Offer
            </span>
            <Gift className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h2
            className="font-black uppercase tracking-tight leading-none mb-2"
            style={{
              color: gold,
              fontSize: 'clamp(3rem, 10vw, 6.5rem)',
            }}
          >
            FREE GIFTS
          </h2>
          <h3
            className="font-black uppercase tracking-wide text-2xl md:text-4xl mb-4"
            style={{ color: '#ffffff' }}
          >
            WITH EVERY ORDER
          </h3>
          <p
            className="font-semibold text-lg md:text-2xl max-w-2xl mx-auto"
            style={{ color: gold }}
          >
            Powerful Bonuses To Support Your Hair Journey
          </p>
        </div>

        {/* Gift grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[18px] md:gap-6 place-items-center mb-10 md:mb-14">
          {giftItems.map((gift, idx) => (
            <GiftCard
              key={idx}
              gift={gift}
              className={idx === 4 ? 'xl:col-start-2' : ''}
            />
          ))}
        </div>

        {/* Trust strip */}
        <div
          className="rounded-2xl p-4 md:p-6 mb-8 md:mb-10"
          style={{ backgroundColor: '#14523f' }}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {trustItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm md:text-base font-bold"
                style={{ color: '#ffffff' }}
              >
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: gold }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="#order-form"
            onClick={scrollToOrder}
            className="inline-block font-black text-base md:text-xl uppercase tracking-wide rounded-full px-8 md:px-12 py-4 md:py-5 shadow-xl transition-transform hover:scale-105"
            style={{
              backgroundColor: red,
              color: '#ffffff',
              textDecoration: 'none',
            }}
          >
            GET MY FREE GIFTS + FULANI HAIR GRO
          </a>
        </div>
      </div>
    </section>
  );
}
