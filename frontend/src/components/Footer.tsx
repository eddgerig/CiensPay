import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black border-t border-primary/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <a href="/" className="flex items-center gap-2">
                <img src="/Logo.png" alt="CiensPay logo" className="w-30 h-10 rounded-lg object-cover" />
              
              </a>
            </div>
            <p className="text-white/60">
              La banca digital del futuro, hoy a tu alcance.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Producto</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/60 hover:text-primary transition-colors">Características</a></li>
              <li><a href="#" className="text-white/60 hover:text-primary transition-colors">Precios</a></li>
              <li><a href="#" className="text-white/60 hover:text-primary transition-colors">Tarjetas</a></li>
              <li><a href="#" className="text-white/60 hover:text-primary transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Empresa</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/60 hover:text-primary transition-colors">Sobre nosotros</a></li>
              <li><a href="#" className="text-white/60 hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-white/60 hover:text-primary transition-colors">Carreras</a></li>
              <li><a href="#" className="text-white/60 hover:text-primary transition-colors">Prensa</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/60 hover:text-primary transition-colors">Términos de uso</a></li>
              <li><a href="#" className="text-white/60 hover:text-primary transition-colors">Privacidad</a></li>
              <li><a href="#" className="text-white/60 hover:text-primary transition-colors">Seguridad</a></li>
              <li><a href="#" className="text-white/60 hover:text-primary transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60">© 2025. Todos los derechos reservados.</p>
          
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
              <Facebook className="text-primary" size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
              <Twitter className="text-primary" size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
              <Instagram className="text-primary" size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
              <Linkedin className="text-primary" size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
