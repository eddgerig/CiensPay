import { Card, CardContent } from '@mui/material';
import { Users, CreditCard, Activity, DollarSign } from 'lucide-react';

interface Stats {
    totalUsers: number;
    activeUsers: number;
    totalCards: number;
    activeCards: number;
    totalBalance: number;
}

interface DashboardStatsProps {
    stats: Stats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card
                sx={{
                    background: 'linear-gradient(135deg, #d3ba30 0%, #b39928 100%)',
                    borderRadius: '16px',
                }}
            >
                <CardContent sx={{ padding: '20px' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-black/70 text-xs mb-1">Total Usuarios</p>
                            <p className="text-black text-2xl">{stats.totalUsers}</p>
                        </div>
                        <Users className="w-8 h-8 text-black/70" />
                    </div>
                </CardContent>
            </Card>



            <Card
                sx={{
                    backgroundColor: 'rgba(211, 186, 48, 0.1)',
                    border: '1px solid rgba(211, 186, 48, 0.2)',
                    borderRadius: '16px',
                }}
            >
                <CardContent sx={{ padding: '20px' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/60 text-xs mb-1">Tarjetas Emitidas</p>
                            <p className="text-[#d3ba30] text-2xl">{stats.totalCards}</p>
                        </div>
                        <CreditCard className="w-8 h-8 text-[#d3ba30]" />
                    </div>
                </CardContent>
            </Card>

            <Card
                sx={{
                    backgroundColor: 'rgba(74, 222, 128, 0.1)',
                    border: '1px solid rgba(74, 222, 128, 0.2)',
                    borderRadius: '16px',
                }}
            >
                <CardContent sx={{ padding: '20px' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/60 text-xs mb-1">Tarjetas Activas</p>
                            <p className="text-green-400 text-2xl">{stats.activeCards}</p>
                        </div>
                        <Activity className="w-8 h-8 text-green-400" />
                    </div>
                </CardContent>
            </Card>

            <Card
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                }}
            >
                <CardContent sx={{ padding: '20px' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/60 text-xs mb-1">Balance Total</p>
                            <p className="text-white text-2xl">${stats.totalBalance.toLocaleString()}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-white/60" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
