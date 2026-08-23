import tractionImg from '@/assets-optimized/hair-types/traction-alopecia.webp';
import dandruffImg from '@/assets-optimized/hair-types/cicatricial-alopecia.webp';
import baldnessImg from '@/assets-optimized/hair-types/alopecia-areata.webp';
import hairLossImg from '@/assets-optimized/hair-types/androgenic-alopecia.webp';

const red = '#d82726';
const gold = '#facc15';

const problemCards = [
  { label: 'EDGES ARE GONE', img: tractionImg, alt: 'Thinning and receding edges' },
  { label: 'DANDRUFF', img: dandruffImg, alt: 'Flaky, irritated scalp' },
  { label: 'BALDNESS', img: baldnessImg, alt: 'Bald patches and hair loss' },
  { label: 'HAIR LOSS', img: hairLossImg, alt: 'Thinning crown and receding hairline' },
];

export const HairProblemsSection = () => {
  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="font-black uppercase leading-none mb-8 md:mb-12">
          <span className="block text-2xl md:text-4xl text-black tracking-tight mb-1">
            DO YOU HAVE THESE
          </span>
          <span
            className="block"
            style={{
              fontSize: 'clamp(3rem, 11vw, 7rem)',
              color: red,
              lineHeight: 1,
            }}
          >
            PROBLEMS
          </span>
          <span className="block text-2xl md:text-4xl text-black tracking-tight mt-1">
            WITH YOUR HAIR?
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
          {problemCards.map((card, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl h-72 sm:h-64 md:h-72"
            >
              <img
                src={card.img}
                alt={card.alt}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div
                className="absolute bottom-0 inset-x-0 py-3 md:py-4 text-center"
                style={{ backgroundColor: red }}
              >
                <span
                  className="font-black uppercase text-sm md:text-base tracking-wider"
                  style={{ color: gold }}
                >
                  {card.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div
          className="rounded-2xl py-6 md:py-8 px-4 mb-6"
          style={{ backgroundColor: '#000000' }}
        >
          <p className="font-black text-white text-lg md:text-2xl uppercase mb-2">
            Don’t ignore it until it’s too late.
          </p>
          <p
            className="font-black text-lg md:text-2xl uppercase"
            style={{ color: gold }}
          >
            You can still turn it around.
          </p>
        </div>

        <div className="py-6 md:py-8">
          <h3 className="font-black uppercase text-3xl md:text-5xl text-black mb-2 leading-tight">
            TAKE ACTION TODAY!
          </h3>
          <h4
            className="font-black uppercase text-2xl md:text-4xl mb-4 leading-tight"
            style={{ color: red }}
          >
            YOUR HAIR DESERVES BETTER.
          </h4>
          <p className="font-black uppercase text-sm md:text-base text-black tracking-wide">
            NOURISH YOUR SCALP | STRENGTHEN YOUR ROOTS | RECLAIM YOUR CONFIDENCE
          </p>
        </div>
      </div>
    </section>
  );
};
