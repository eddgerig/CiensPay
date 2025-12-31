import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

import '../styles/Hero.css';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 circuit-background" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 md:px-32 lg:px-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-primary">Ciencia que vence las sombras,</span> tecnología que cuida tu capital.
            </h1>

            <p className="text-xl text-white/70 max-w-lg">
              Gestiona tu dinero de manera inteligente con CiensPay.
              Un ecosistema digital creado por la próxima generación de computistas de la UCV.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary text-black hover:bg-primary/90 group">
                Comenzar ahora
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>

            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <div className="circuit-container">
                <div className="circuit-ring circuit-ring-1" />
                <div className="circuit-ring circuit-ring-2" />
                <div className="circuit-ring circuit-ring-3" />
                <ImageWithFallback
                  src="/log_dorado.png"
                  alt="CiensPay App"
                  className="hero-spinning-image"
                />
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/10 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
