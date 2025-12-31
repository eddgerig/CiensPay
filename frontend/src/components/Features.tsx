import { Smartphone, Zap, Shield, CreditCard, TrendingUp, Globe, Clock1, History } from 'lucide-react';
import { Card } from './ui/card';

const features = [
  {
    icon: Clock1,
    title: 'Acceso 24/7',
    description: 'Podrás acceder a tus finanzas desde cualquier lugar y en cualquier momento.',
  },
  {
    icon: CreditCard,
    title: 'Tarjetas Virtuales',
    description: 'Obtendrás tarjetas virtuales ilimitadas para tus compras online de forma segura.',
  },
  {
    icon: Shield,
    title: 'Seguridad Avanzada',
    description: 'Tu dinero estatrá protegido con la tecnología más avanzada.',
  },
  {
    icon: History,
    title: 'Historial de Transacciones',
    description: 'Consulta tu historial de compras y gastos con solo un clic.',
  },
  {
    icon: TrendingUp,
    title: 'Análisis Financiero',
    description: 'Visualiza tus gastos e ingresos con gráficos detallados y recomendaciones personalizadas.',
  },
  {
    icon: Globe,
    title: 'Pagos Internacionales',
    description: 'Realiza transacciones globales con las mejores tasas de cambio del mercado.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-black to-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 mt-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Todo lo que necesitas en
            <span className="block text-primary">una sola aplicación</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            CiensPay te ofrece las herramientas más avanzadas para gestionar tu dinero y realizar compras online de manera eficiente y segura.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur-sm border-primary/20 p-6 hover:border-primary/50 transition-all hover:scale-105"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
