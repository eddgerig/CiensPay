import { Check } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const benefits = [
  'Sin comisiones mensuales de mantenimiento',
  'Compras en gran variedad de plataformas ecommerce',
  'Cashback del 2% en todas tus compras',
  'Obtén Tarjetas Virtuales de forma instantánea',
];

export function Benefits() {
  return (
    <section id="benefits" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 md:order-1">
            <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-2xl" />
            <ImageWithFallback
              src="/card.png"
              alt="Tarjeta CiensPay"
              className="relative z-10 w-300 h-300 rounded-3xl shadow-2xl"
            />
          </div>

          <div className="space-y-6 order-1 md:order-2">


            <h2 className="text-4xl md:text-5xl font-bold">
              Más que una cuenta,
              <span className="block text-primary">una experiencia premium</span>
            </h2>

            <p className="text-white/70 text-lg">
              Disfruta de beneficios exclusivos diseñados para simplificar tu vida financiera.
            </p>

            <div className="space-y-4 pt-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="text-black" size={16} />
                  </div>
                  <span className="text-white/90">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
