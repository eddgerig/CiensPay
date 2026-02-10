import { useState } from 'react';
import { Card, CardContent, TablePagination } from '@mui/material';
import { Filter, Download } from 'lucide-react';
import recentTransactions from '../data/recentTransactions.json';

export function TransactionHistory({ userData }: { userData: any[] } = { userData: [] }) {
    const [page, setPage] = useState(0);
    const rowsPerPage = 6;

    // Función para formatear fecha a "d Mes año"
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            return `${day} ${month} ${year}`;
        } catch (error) {
            return dateString;
        }
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    // Calculate pagination
    const paginatedTransactions = (userData || []).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Card
            sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(211, 186, 48, 0.1)',
                borderRadius: '20px',
                height: 'calc(100vh - 140px)', // Occupy viewport height
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <CardContent sx={{
                padding: '32px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
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

                <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {paginatedTransactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all cursor-pointer group border border-transparent hover:border-primary/20"
                        >
                            <div className="flex flex-row items-center gap-3">
                                <p className="text-primary text-sm font-medium">{transaction.descripcion}</p>
                                <p className="text-xs text-white/60">{formatDate(transaction.fecha_operacion)}</p>
                            </div>

                            <p
                                className={`text-base font-medium ${['DEP', 'REE'].includes(transaction.tipo) ? 'text-primary' : 'text-white'
                                    }`}
                            >
                                {['DEP', 'REE'].includes(transaction.tipo) ? '+' : '-'}${Math.abs(transaction.monto).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>

                <TablePagination
                    component="div"
                    count={userData?.length || 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[6]}
                    labelRowsPerPage=""
                    sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        '.MuiTablePagination-select': {
                            display: 'none',
                        },
                        '.MuiTablePagination-selectLabel': {
                            display: 'none',
                        },
                        '.MuiTablePagination-selectIcon': {
                            display: 'none',
                        },
                        '.MuiTablePagination-actions': {
                            color: 'white',
                        },
                        marginTop: '16px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                />
            </CardContent>
        </Card>
    );
}
