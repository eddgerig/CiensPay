import { Button, Avatar } from '@mui/material';
import { LogOut } from 'lucide-react';

interface DashboardHeaderProps {
    onLogout: () => void;
    subtitle?: string;
    userInitials?: string;
}

export function DashboardHeader({ onLogout, subtitle, userInitials = "DU" }: DashboardHeaderProps) {
    return (
        <header className="bg-black/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            src="/log_dorado.png"
                            alt="CiensPay Logo"
                            className="w-10 h-10 object-contain"
                        />
                        <div>
                            <span className="text-2xl text-white block leading-none">CiensPay</span>
                            {subtitle && <p className="text-white/40 text-xs">{subtitle}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Avatar
                            sx={{
                                backgroundColor: '#d3ba30',
                                color: '#000000',
                                width: 40,
                                height: 40,
                            }}
                        >
                            {userInitials}
                        </Avatar>
                        <Button
                              onClick={() => {localStorage.removeItem('access'); localStorage.removeItem('refresh'); localStorage.removeItem('user'); onLogout();}} 
                            startIcon={<LogOut className="w-4 h-4" />}
                            sx={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                textTransform: 'none',
                                '&:hover': {
                                    color: '#d3ba30',
                                },
                            }}
                        >
                            Salir
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
