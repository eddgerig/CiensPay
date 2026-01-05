import { CiensPayCard } from '../components/CiensPayCard';
import { BalanceCard } from '../components/BalanceCard';
import { TransactionHistory } from '../components/TransactionHistory';
import { DashboardHeader } from '../components/DashboardHeader';

interface DashboardProps {
    onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {



    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black">
            {/* Header */}
            {/* Header */}
            <DashboardHeader onLogout={onLogout} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section <div className="mb-8">
                    <h1 className="text-3xl text-white mb-2">¡Bienvenido de vuelta!</h1>
                    <p className="text-white/60">Aquí está un resumen de tu actividad financiera</p>
                </div>*/}


                {/* Top Panel - Balance and Card */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Panel - Cards */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6 min-w-[350px]">
                        <BalanceCard />
                        <CiensPayCard />
                    </div>

                    {/* Right Panel - Transactions */}
                    <div className="flex-1">
                        <TransactionHistory />
                    </div>
                </div>
            </div>
        </div>
    );
}