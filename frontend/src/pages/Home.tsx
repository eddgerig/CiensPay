import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Benefits } from '../components/Benefits';
//import { Security } from '../components/Security';
import { CTA } from '../components/CTA';
import { Footer } from '../components/Footer';

export function Home() {
    return (
        <div className=" pt-10 min-h-screen bg-black">
            <Header />
            <main>
                <Hero />
                <Features />
                <Benefits />

                <CTA />
            </main>
            <Footer />
        </div>
    );
}
