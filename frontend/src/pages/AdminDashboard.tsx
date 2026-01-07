import { useState } from 'react';
import {
    Button,
    Card,
    CardContent,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Tabs,
    Tab,
    Box
} from '@mui/material';
import {
    LogOut,
    Users,
    CreditCard,
    Plus,
    Search,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    UserPlus,
    DollarSign,
    Activity,
    Filter
} from 'lucide-react';

import { DashboardHeader } from '../components/DashboardHeader';
import usersData from '../data/users.json';

interface AdminDashboardProps {
    onLogout: () => void;
}

interface User {
    id: number;
    documentType: string;
    documentNumber: string;
    fullName: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'pending';
    registrationDate: string;
    hasCard: boolean;
    balance: number;
}

interface VirtualCard {
    id: number;
    userId: number;
    userName: string;
    documentNumber: string;
    cardNumber: string;
    status: 'active' | 'blocked';
    expiryDate: string;
    limit: number;
    assignedDate: string;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
    const [currentTab, setCurrentTab] = useState(0);
    const [openAddUser, setOpenAddUser] = useState(false);
    const [openAssignCard, setOpenAssignCard] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data - usuarios registrados
    const [users, setUsers] = useState<User[]>(usersData as User[]);


    const [cards, setCards] = useState<VirtualCard[]>([
        {
            id: 1,
            userId: 1,
            userName: 'Juan Pérez',
            documentNumber: '12345678',
            cardNumber: '5123 4567 8901 2345',
            status: 'active',
            expiryDate: '12/26',
            limit: 50000,
            assignedDate: '15 Dic 2025'
        },
        {
            id: 2,
            userId: 2,
            userName: 'María González',
            documentNumber: '23456789',
            cardNumber: '5123 4567 8901 3456',
            status: 'active',
            expiryDate: '01/27',
            limit: 100000,
            assignedDate: '18 Dic 2025'
        },
        {
            id: 3,
            userId: 5,
            userName: 'Ana Martínez',
            documentNumber: '45678901',
            cardNumber: '5123 4567 8901 4567',
            status: 'blocked',
            expiryDate: '11/26',
            limit: 50000,
            assignedDate: '10 Dic 2025'
        },
    ]);

    // Form state for new user
    const [newUser, setNewUser] = useState({
        documentType: 'V',
        documentNumber: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    // Form state for assign card
    const [newCard, setNewCard] = useState({
        documentNumber: '',
        limit: 50000,
    });

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.documentNumber.includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        totalCards: cards.length,
        activeCards: cards.filter(c => c.status === 'active').length,
        totalBalance: users.reduce((sum, u) => sum + u.balance, 0),
    };

    const handleAddUser = () => {
        // Aquí iría la lógica para agregar usuario
        console.log('Nuevo usuario:', newUser);
        setOpenAddUser(false);
        setNewUser({
            documentType: 'V',
            documentNumber: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
        });
    };

    const handleAssignCard = () => {
        // Buscar usuario por cédula
        const user = users.find(u => u.documentNumber === newCard.documentNumber);
        if (user && newCard.documentNumber && newCard.limit) {
            console.log('Asignar tarjeta a cédula:', newCard.documentNumber, 'Límite:', newCard.limit);
            setOpenAssignCard(false);
            setNewCard({ documentNumber: '', limit: 50000 });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return '#4ade80';
            case 'inactive':
                return '#f87171';
            case 'pending':
                return '#fbbf24';
            default:
                return '#6b7280';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active':
                return 'Activo';
            case 'inactive':
                return 'Inactivo';
            case 'pending':
                return 'Pendiente';
            default:
                return status;
        }
    };

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '& fieldset': {
                borderColor: 'rgba(211, 186, 48, 0.3)',
            },
            '&:hover fieldset': {
                borderColor: 'rgba(211, 186, 48, 0.5)',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#d3ba30',
            },
        },
        '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.6)',
            '&.Mui-focused': {
                color: '#d3ba30',
            },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black">
            {/* Header */}
            <DashboardHeader
                onLogout={onLogout}
                subtitle="Panel de Administración"
                userInitials="AD"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section       <div className="mb-8">
                    <h1 className="text-3xl text-white mb-2">Panel de Administración</h1>
                    <p className="text-white/60">Gestión de usuarios y tarjetas virtuales</p>
                </div>
 */}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
                            backgroundColor: 'rgba(74, 222, 128, 0.1)',
                            border: '1px solid rgba(74, 222, 128, 0.2)',
                            borderRadius: '16px',
                        }}
                    >
                        <CardContent sx={{ padding: '20px' }}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white/60 text-xs mb-1">Usuarios Activos</p>
                                    <p className="text-green-400 text-2xl">{stats.activeUsers}</p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-green-400" />
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

                {/* Tabs */}
                <Card
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(211, 186, 48, 0.1)',
                        borderRadius: '20px',
                    }}
                >
                    <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <Tabs
                            value={currentTab}
                            onChange={(e, newValue) => setCurrentTab(newValue)}
                            sx={{
                                '& .MuiTab-root': {
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    textTransform: 'none',
                                    fontSize: '16px',
                                    '&.Mui-selected': {
                                        color: '#d3ba30',
                                    },
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#d3ba30',
                                },
                            }}
                        >
                            <Tab icon={<Users className="w-5 h-5" />} iconPosition="start" label="Usuarios Registrados" />
                            <Tab icon={<CreditCard className="w-5 h-5" />} iconPosition="start" label="Tarjetas Virtuales" />
                        </Tabs>
                    </Box>

                    {/* Tab 1: Usuarios Registrados */}
                    {currentTab === 0 && (
                        <CardContent sx={{ padding: '32px' }}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="relative flex-1 max-w-md">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="text"
                                            placeholder="Buscar usuario por nombre, cédula o email..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-[#d3ba30]/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#d3ba30]"
                                        />
                                    </div>
                                </div>
                                <Button
                                    variant="contained"
                                    startIcon={<UserPlus className="w-4 h-4" />}
                                    onClick={() => setOpenAddUser(true)}
                                    sx={{
                                        backgroundColor: '#d3ba30',
                                        color: '#000000',
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: '#b39928',
                                        },
                                    }}
                                >
                                    Registrar Usuario
                                </Button>
                            </div>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                Usuario
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                Documento
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                Contacto
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                Estado
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                Balance
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                Tarjeta
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                Acciones
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
                                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar
                                                            sx={{
                                                                backgroundColor: '#d3ba30',
                                                                color: '#000000',
                                                                width: 36,
                                                                height: 36,
                                                            }}
                                                        >
                                                            {user.fullName.charAt(0)}
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-white">{user.fullName}</p>
                                                            <p className="text-white/40 text-xs">{user.registrationDate}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    {user.documentType}-{user.documentNumber}
                                                </TableCell>
                                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <div>
                                                        <p className="text-white text-sm">{user.email}</p>
                                                        <p className="text-white/40 text-xs">{user.phone}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <Chip
                                                        label={getStatusLabel(user.status)}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: `${getStatusColor(user.status)}20`,
                                                            color: getStatusColor(user.status),
                                                            border: `1px solid ${getStatusColor(user.status)}40`,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    ${user.balance.toLocaleString()}
                                                </TableCell>
                                                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    {user.hasCard ? (
                                                        <Chip
                                                            icon={<CheckCircle className="w-3 h-3" />}
                                                            label="Asignada"
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: 'rgba(74, 222, 128, 0.1)',
                                                                color: '#4ade80',
                                                                border: '1px solid rgba(74, 222, 128, 0.2)',
                                                            }}
                                                        />
                                                    ) : (
                                                        <Chip
                                                            icon={<XCircle className="w-3 h-3" />}
                                                            label="Sin tarjeta"
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: 'rgba(248, 113, 113, 0.1)',
                                                                color: '#f87171',
                                                                border: '1px solid rgba(248, 113, 113, 0.2)',
                                                            }}
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <div className="flex items-center gap-2">
                                                        {!user.hasCard && (
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => {
                                                                    setSelectedUser(user);
                                                                    setOpenAssignCard(true);
                                                                }}
                                                                sx={{ color: '#d3ba30' }}
                                                            >
                                                                <CreditCard className="w-4 h-4" />
                                                            </IconButton>
                                                        )}
                                                        <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                            <Edit className="w-4 h-4" />
                                                        </IconButton>
                                                        <IconButton size="small" sx={{ color: 'rgba(248, 113, 113, 0.8)' }}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </IconButton>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    )}

                    {/* Tab 2: Tarjetas Virtuales */}
                    {currentTab === 1 && (
                        <CardContent sx={{ padding: '32px' }}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl text-white">Tarjetas Virtuales Asignadas</h3>
                                <Button
                                    variant="contained"
                                    startIcon={<CreditCard className="w-4 h-4" />}
                                    onClick={() => {
                                        setSelectedUser(null);
                                        setOpenAssignCard(true);
                                    }}
                                    sx={{
                                        backgroundColor: '#d3ba30',
                                        color: '#000000',
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: '#b39928',
                                        },
                                    }}
                                >
                                    Asignar Tarjeta
                                </Button>
                            </div>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                Titular
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                Número de Tarjeta
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                Cédula
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                Límite
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                Fecha Asignación
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                Vencimiento
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                Estado
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                Acciones
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cards.map((card) => (
                                            <TableRow key={card.id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
                                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar
                                                            sx={{
                                                                backgroundColor: '#d3ba30',
                                                                color: '#000000',
                                                                width: 36,
                                                                height: 36,
                                                            }}
                                                        >
                                                            {card.userName.charAt(0)}
                                                        </Avatar>
                                                        <p className="text-white">{card.userName}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <span className="font-mono tracking-wider">{card.cardNumber}</span>
                                                </TableCell>
                                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    {card.documentNumber}
                                                </TableCell>
                                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <span className="text-[#d3ba30]">${card.limit.toLocaleString()}</span>
                                                </TableCell>
                                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    {card.assignedDate}
                                                </TableCell>
                                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    {card.expiryDate}
                                                </TableCell>
                                                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <Chip
                                                        label={card.status === 'active' ? 'Activa' : 'Bloqueada'}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: card.status === 'active' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                                                            color: card.status === 'active' ? '#4ade80' : '#f87171',
                                                            border: `1px solid ${card.status === 'active' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <div className="flex items-center gap-2">
                                                        <IconButton
                                                            size="small"
                                                            sx={{
                                                                color: card.status === 'active' ? '#f87171' : '#4ade80',
                                                            }}
                                                        >
                                                            {card.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                        </IconButton>
                                                        <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                            <Edit className="w-4 h-4" />
                                                        </IconButton>
                                                        <IconButton size="small" sx={{ color: 'rgba(248, 113, 113, 0.8)' }}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </IconButton>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    )}
                </Card>
            </div>

            {/* Dialog: Add User */}
            <Dialog
                open={openAddUser}
                onClose={() => setOpenAddUser(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: '#1a1a1a',
                        backgroundImage: 'none',
                        border: '1px solid rgba(211, 186, 48, 0.2)',
                        borderRadius: '16px',
                        minWidth: '500px',
                    },
                }}
            >
                <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    Registrar Nuevo Usuario
                </DialogTitle>
                <DialogContent sx={{ paddingTop: '24px' }}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <FormControl fullWidth sx={inputStyles}>
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    value={newUser.documentType}
                                    onChange={(e) => setNewUser({ ...newUser, documentType: e.target.value })}
                                    label="Tipo"
                                    sx={{ color: 'white' }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: '#1a1a1a',
                                                border: '1px solid rgba(211, 186, 48, 0.3)',
                                                '& .MuiMenuItem-root': {
                                                    color: 'white',
                                                    '&:hover': { backgroundColor: 'rgba(211, 186, 48, 0.1)' },
                                                    '&.Mui-selected': { backgroundColor: 'rgba(211, 186, 48, 0.2)' },
                                                },
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="V">V</MenuItem>
                                    <MenuItem value="J">J</MenuItem>
                                    <MenuItem value="E">E</MenuItem>
                                    <MenuItem value="G">G</MenuItem>
                                </Select>
                            </FormControl>

                            <div className="col-span-2">
                                <TextField
                                    fullWidth
                                    label="Cédula"
                                    value={newUser.documentNumber}
                                    onChange={(e) => setNewUser({ ...newUser, documentNumber: e.target.value })}
                                    sx={inputStyles}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <TextField
                                fullWidth
                                label="Nombre"
                                value={newUser.firstName}
                                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                                sx={inputStyles}
                            />
                            <TextField
                                fullWidth
                                label="Apellido"
                                value={newUser.lastName}
                                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                                sx={inputStyles}
                            />
                        </div>

                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            sx={inputStyles}
                        />

                        <TextField
                            fullWidth
                            label="Teléfono"
                            value={newUser.phone}
                            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                            sx={inputStyles}
                        />
                    </div>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Button
                        onClick={() => setOpenAddUser(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'none' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleAddUser}
                        variant="contained"
                        sx={{
                            backgroundColor: '#d3ba30',
                            color: '#000000',
                            textTransform: 'none',
                            '&:hover': { backgroundColor: '#b39928' },
                        }}
                    >
                        Registrar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog: Assign Card */}
            <Dialog
                open={openAssignCard}
                onClose={() => setOpenAssignCard(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: '#1a1a1a',
                        backgroundImage: 'none',
                        border: '1px solid rgba(211, 186, 48, 0.2)',
                        borderRadius: '16px',
                        minWidth: '500px',
                    },
                }}
            >
                <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    Asignar Tarjeta Virtual
                </DialogTitle>
                <DialogContent sx={{ paddingTop: '24px' }}>
                    <div className="space-y-4">
                        {selectedUser && (
                            <div className="p-4 bg-white/5 border border-[#d3ba30]/20 rounded-lg mb-4">
                                <p className="text-white/60 text-sm mb-1">Usuario seleccionado:</p>
                                <p className="text-white text-lg">{selectedUser.fullName}</p>
                                <p className="text-white/60 text-sm">{selectedUser.documentType}-{selectedUser.documentNumber}</p>
                            </div>
                        )}

                        {!selectedUser && (
                            <TextField
                                fullWidth
                                label="Cédula del Cliente"
                                placeholder="Ingrese número de cédula"
                                value={newCard.documentNumber}
                                onChange={(e) => setNewCard({ ...newCard, documentNumber: e.target.value })}
                                sx={inputStyles}
                            />
                        )}

                        <TextField
                            fullWidth
                            label="Límite de Tarjeta"
                            type="number"
                            placeholder="Ingrese el límite de crédito"
                            value={newCard.limit}
                            onChange={(e) => setNewCard({ ...newCard, limit: parseInt(e.target.value) || 0 })}
                            sx={inputStyles}
                            InputProps={{
                                startAdornment: <span style={{ color: 'rgba(255, 255, 255, 0.6)', marginRight: '4px' }}>$</span>,
                            }}
                        />

                        <div className="p-4 bg-[#d3ba30]/10 border border-[#d3ba30]/30 rounded-lg">
                            <p className="text-[#d3ba30] text-sm mb-2">Información de la tarjeta:</p>
                            <ul className="text-white/60 text-xs space-y-1">
                                <li>• La tarjeta será activada automáticamente</li>
                                <li>• Fecha de expiración: 3 años desde hoy</li>
                                <li>• CVV generado automáticamente</li>
                                <li>• El usuario recibirá notificación por email</li>
                            </ul>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Button
                        onClick={() => {
                            setOpenAssignCard(false);
                            setSelectedUser(null);
                        }}
                        sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'none' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleAssignCard}
                        variant="contained"
                        startIcon={<CreditCard className="w-4 h-4" />}
                        sx={{
                            backgroundColor: '#d3ba30',
                            color: '#000000',
                            textTransform: 'none',
                            '&:hover': { backgroundColor: '#b39928' },
                        }}
                    >
                        Asignar Tarjeta
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}