import { Shield, Eye, Users, Monitor, Shuffle, Lock } from 'lucide-react';
import { Card } from './ui/card';

const values = [
  {
    icon: Lock,
    title: 'Seguridad',
    description: 'Protegemos la información y las transacciones financieras mediante buenas prácticas de desarrollo y control de datos.',
  },
  {
    icon: Shield,
    title: 'Confiabilidad',
    description: 'Garantizamos la correcta autorización y procesamiento de pagos dentro del sistema interbancario.',
  },
  {
    icon: Shuffle, // Represents Interoperability
    title: 'Interoperabilidad',
    description: 'Promovemos la integración eficiente con otros bancos y comercios mediante protocolos y estándares acordados.',
  },
  {
    icon: Eye,
    title: 'Transparencia',
    description: 'Facilitamos a los usuarios la consulta clara de sus tarjetas, saldos y transacciones.',
  },
  {
    icon: Monitor, // Represents Tech Innovation
    title: 'Innovación tecnológica',
    description: 'Adoptamos tecnologías modernas para mejorar continuamente nuestros servicios bancarios digitales.',
  },
  {
    icon: Users,
    title: 'Trabajo colaborativo',
    description: 'Fomentamos la cooperación con otros equipos para asegurar la compatibilidad e integración del ecosistema.',
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

        {/* Mission and Vision Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-card/30 backdrop-blur-sm p-8 rounded-2xl border border-primary/20">
            <h3 className="text-3xl font-bold mb-4 text-primary">Misión</h3>
            <p className="text-white/80 text-lg leading-relaxed">
              Nuestra misión es ofrecer servicios de pago electrónico seguros, eficientes e interoperables, mediante el desarrollo de soluciones bancarias digitales que permitan la emisión de tarjetas de crédito, la autorización de transacciones y la integración con comercios y otras entidades bancarias, garantizando la correcta ejecución de pagos electrónicos dentro de un ecosistema interbancario simulado.
            </p>
          </div>

          <div className="bg-card/30 backdrop-blur-sm p-8 rounded-2xl border border-primary/20">
            <h3 className="text-3xl font-bold mb-4 text-primary">Visión</h3>
            <p className="text-white/80 text-lg leading-relaxed">
              Nuestra visión es consolidarnos como un banco digital de referencia dentro del ecosistema de comercio electrónico, destacándonos por la confiabilidad de nuestros servicios, la eficiencia en el procesamiento interbancario y la capacidad de adaptación a nuevas tecnologías y estándares de pagos electrónicos.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Nuestros <span className="text-primary">Valores</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Los principios que guían cada una de nuestras acciones y desarrollos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur-sm border-primary/20 p-6 hover:border-primary/50 transition-all hover:scale-105"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <value.icon className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{value.title}</h3>
              <p className="text-white/70">{value.description}</p>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}
