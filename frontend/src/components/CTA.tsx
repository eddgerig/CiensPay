import { useNavigate } from 'react-router-dom';
import { ArrowRight, Apple, Smartphone } from 'lucide-react';
import { Button } from './ui/button';

export function CTA() {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 via-black to-black">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Únete a la revolución
            <span className="block text-primary">financiera digital</span>
          </h2>

          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Miles de personas ya confían en CiensPay para gestionar su dinero.
            Descarga la app y empieza a disfrutar de la mejor experiencia bancaria.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              className="bg-primary text-black hover:bg-primary/90 group"
              onClick={() => navigate('/register')}
            >
              Crear cuenta gratis
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
          </div>



          <div className="mt-12 pt-12 border-t border-primary/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">1K+</div>
                <div className="text-white/60">Clientes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">4.9★</div>
                <div className="text-white/60">Rating en stores</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">15+</div>
                <div className="text-white/60">Países</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">$50M+</div>
                <div className="text-white/60">En transacciones</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
