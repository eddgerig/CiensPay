import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import '../styles/globals.css';
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-primary/20">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">

            <img src="/CiensPay_logo.png" alt="CiensPay logo" className="h-12 w-auto object-contain" />

          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/80 hover:text-primary transition-colors">
              Características
            </a>
            <a href="#benefits" className="text-white/80 hover:text-primary transition-colors">
              Beneficios
            </a>

            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black">
              Iniciar Sesión
            </Button>
            <Button className="bg-primary text-black hover:bg-primary/90">
              Crear Cuenta
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 space-y-4 border-t border-primary/20">
            <a
              href="#features"
              className="block text-white/80 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Características
            </a>
            <a
              href="#benefits"
              className="block text-white/80 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Beneficios
            </a>
            <a
              href="#security"
              className="block text-white/80 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Seguridad
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black w-full">
                Iniciar Sesión
              </Button>
              <Button className="bg-primary text-black hover:bg-primary/90 w-full">
                Crear Cuenta
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
