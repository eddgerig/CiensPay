import { Card, CardContent } from '@mui/material';
import { Filter, Download } from 'lucide-react';
import recentTransactions from '../data/recentTransactions.json';

export function TransactionHistory() {
    return (
        <Card
            sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(211, 186, 48, 0.1)',
                borderRadius: '20px',
            }}
        >
            <CardContent sx={{ padding: '32px' }}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl text-white">Historial de Transacciones</h3>
                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <Filter className="w-5 h-5 text-white/60" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <Download className="w-5 h-5 text-white/60" />
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    {recentTransactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all cursor-pointer group border border-transparent hover:border-primary/20"
                        >
                            <div className="flex flex-col gap-1">
                                <p className="text-primary text-sm font-medium">{transaction.name}</p>
                                <p className=" text-xs text-white">{transaction.date}</p>
                            </div>

                            <p
                                className={`text-base font-medium ${transaction.type === 'income' ? 'text-primary' : 'text-white'
                                    }`}
                            >
                                {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>

                <button className="w-full mt-6 py-3 text-primary hover:bg-primary/10 rounded-xl transition-colors">
                    Ver todas las transacciones
                </button>
            </CardContent>
        </Card>
    );
}
