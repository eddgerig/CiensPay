//import { Lock, Fingerprint, Eye, Bell } from 'lucide-react';
//import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';


export function Security() {
  return (
    <section id="security" className="py-24 bg-black ">
      <div className="container mx-auto px-4 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tu dinero protegido
              <span className="block text-primary">en todo momento</span>
            </h2>
            <p className="text-white/70 text-lg">
              La seguridad es nuestra prioridad número uno. Utilizamos la tecnología más avanzada para mantener tu dinero a salvo.
            </p>
          </div>

          <div className="relative max-w-2xl mx-auto lg:mx-0">
            <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl " />
            <ImageWithFallback
              src="../../public/ecommerce.png"
              className="relative z-10 w-full rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
