import { useState } from 'react';
import { Card, CardContent } from '@mui/material';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';

interface BalanceCardProps {
    totalBalance?: number;
    income?: number;
    expenses?: number;
    percentageChange?: number;
}

export function BalanceCard(props: any) {
    const [showBalance, setShowBalance] = useState(true);
    const { userData, totalBalance = 0, income = 0, expenses = 0, percentageChange = 0 } = props;

    return (
        <Card
            sx={{
                background: 'linear-gradient(135deg, #d3ba30 0%, #b39928 100%)',
                borderRadius: '20px',
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
            }}
        >
            <CardContent sx={{ padding: '24px' }}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center">
                        <p className="text-black/70 text-sm font-medium mb-1">Disponible</p>
                        <div className="flex items-center gap-2">
                            {showBalance ? (
                                <h2 className="text-4xl font-bold text-black tracking-tight">
                                    ${userData?.saldo?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                </h2>
                            ) : (
                                <h2 className="text-4xl font-bold text-black tracking-tight">••••••</h2>
                            )}
                            <button
                                onClick={() => setShowBalance(!showBalance)}
                                className="p-1.5 hover:bg-black/10 rounded-full transition-colors ml-1"
                            >
                                {showBalance ? (
                                    <Eye className="w-5 h-5 text-black/70" />
                                ) : (
                                    <EyeOff className="w-5 h-5 text-black/70" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-12 pt-4 border-t border-black/10">
                        <div className="text-center">
                            <p className="text-black/70 text-xs font-semibold uppercase tracking-wider mb-1">Límite Diario</p>
                            <div className="flex items-center justify-center gap-1.5">
                                <p className="text-black font-semibold text-lg">${userData?.limite_retiro_diario?.toLocaleString() || '5,000'}</p>
                            </div>
                        </div>
                        {/*<div className="text-center">
                            <p className="text-black/70 text-xs font-semibold uppercase tracking-wider mb-1">Disponible</p>
                            <p className="text-black font-semibold text-lg">${userData?.saldo?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
                        </div>*/}   
                    </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
            </CardContent>
        </Card>
    );
}
