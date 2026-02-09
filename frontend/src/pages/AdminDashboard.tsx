import { useState, useEffect } from 'react';
import {
    Button,
    Card,
    CardContent,
    Avatar,
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
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    //LogOut,
    Users,
    CreditCard,
    //Plus,
    Search,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    UserPlus,
    //Filter
} from 'lucide-react';

import { DashboardHeader } from '../components/DashboardHeader';
import { DashboardStats } from '../components/DashboardStats';
import { AddUserDialog } from '../components/AddUserDialog';
import { AssignCardDialog } from '../components/AssignCardDialog';
// @ts-ignore - admin.js is a JavaScript file
import { adminAPI } from '../api/admin';
import type { User } from '../types/user';

interface AdminDashboardProps {
    onLogout: () => void;
}

interface VirtualCard {
    id: number;
    numero_tarjeta: string;
    saldo: number;
    fecha_asignacion: string;
    fecha_vencimiento: string;
    activo: boolean;
    userName: string;
    documentNumber: string;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
    const [currentTab, setCurrentTab] = useState(0);
    const [openAddUser, setOpenAddUser] = useState(false);
    const [openAssignCard, setOpenAssignCard] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // API data state
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    // Extract all cards from users for the virtual cards tab
    const cards: VirtualCard[] = users.flatMap(user =>
        user.cards.map(card => ({
            ...card,
            userName: user.full_name,
            documentNumber: user.document_number
        }))
    );

    // Fetch users with cards from API
    const fetchUsersWithCards = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getUsersWithCards({
                page,
                page_size: 20,
                search: searchTerm || undefined
            });

            if (response.data.success) {
                setUsers(response.data.data);
                setTotal(response.data.total);
                setError(null);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar los usuarios');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount and when page changes
    useEffect(() => {
        fetchUsersWithCards();
    }, [page]);

    // Debounce search term to avoid excessive API calls
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (page === 1) {
                fetchUsersWithCards();
            } else {
                setPage(1); // Reset to page 1 when search changes
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Form state for new user
    // Managed in AddUserDialog

    // Form state for assign card
    // Managed in AssignCardDialog

    // Filtering is now handled by the API search parameter
    const filteredUsers = users;

    const stats = {
        totalUsers: total,
        activeUsers: users.filter(u => u.status === 'active').length,
        totalCards: cards.length,
        activeCards: cards.filter(c => c.activo).length,
        totalBalance: users.reduce((sum, u) => sum + parseFloat(u.balance || '0'), 0),
    };

    const handleHandleAddUser = async (userData: any) => {
        try {
            if (selectedUser) {
                // EDIT MODE: Update existing user
                const updateData = {
                    full_name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
                    email: userData.email,
                    phone: userData.phone,
                    document_type: userData.documentType,
                    document_number: userData.documentNumber,
                };

                setLoading(true);
                const response = await adminAPI.updateUser(selectedUser.id, updateData);

                if (response.data.success) {
                    setOpenAddUser(false);
                    setSelectedUser(null);
                    await fetchUsersWithCards();
                    setError(null);
                } else {
                    setError(response.data.message || 'Error al actualizar usuario');
                }
            } else {
                // CREATE MODE: Register new user
                console.log('Nuevo usuario:', userData);
                setOpenAddUser(false);
                // TODO: Implement user registration API call
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al procesar la solicitud');
            console.error('Error handling user:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!window.confirm('¿Estás seguro de que deseas desactivar este usuario?')) {
            return;
        }

        try {
            setLoading(true);
            const response = await adminAPI.deleteUser(userId, false); // soft delete

            if (response.data.success) {
                await fetchUsersWithCards();
                setError(null);
            } else {
                setError(response.data.message || 'Error al eliminar usuario');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al eliminar usuario');
            console.error('Error deleting user:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleHandleAssignCard = () => {
        // After assigning a card, refresh the users list
        fetchUsersWithCards();
        // Close dialog after a short delay to let user see the success message
        setTimeout(() => {
            setOpenAssignCard(false);
            setSelectedUser(null);
        }, 2000);
    };

    const handleToggleCardStatus = (cardId: number) => {
        // TODO: Implement API call to toggle card status
        console.log('Toggle card status:', cardId);
        // After toggling, refresh the users list
        // fetchUsersWithCards();
    };

    const handleDeleteCard = (cardId: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta tarjeta?')) {
            // TODO: Implement API call to delete card
            console.log('Delete card:', cardId);
            // After deleting, refresh the users list
            // fetchUsersWithCards();
        }
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
                {/* Stats Cards */}
                <DashboardStats stats={stats} />

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
                            onChange={(_, newValue) => setCurrentTab(newValue)}
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
                            {/* Loading State */}
                            {loading && (
                                <div className="flex justify-center items-center py-12">
                                    <CircularProgress sx={{ color: '#d3ba30' }} />
                                </div>
                            )}

                            {/* Error State */}
                            {error && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            )}

                            {/* Content */}
                            {!loading && !error && (
                                <>
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
                                            onClick={() => {
                                                setSelectedUser(null);
                                                setOpenAddUser(true);
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
                                                                    {user.full_name.charAt(0)}
                                                                </Avatar>
                                                                <div>
                                                                    <p className="text-white">{user.full_name}</p>
                                                                    <p className="text-white/40 text-xs">{new Date(user.registration_date).toLocaleDateString()}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                            {user.document_type}-{user.document_number}
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                            <div>
                                                                <p className="text-white text-sm">{user.email}</p>
                                                                <p className="text-white/40 text-xs">{user.phone}</p>
                                                            </div>
                                                        </TableCell>

                                                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                            ${parseFloat(user.balance || '0').toLocaleString()}
                                                        </TableCell>
                                                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                            {user.has_card ? (
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
                                                                        cursor: 'pointer',
                                                                        '&:hover': {
                                                                            backgroundColor: 'rgba(248, 113, 113, 0.2)',
                                                                        }
                                                                    }}
                                                                    onClick={() => {
                                                                        setSelectedUser(user);
                                                                        setOpenAssignCard(true);
                                                                    }}
                                                                />
                                                            )}
                                                        </TableCell>
                                                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                            <div className="flex items-center gap-2">
                                                                {!user.has_card && (
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
                                                                <IconButton
                                                                    size="small"
                                                                    sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                                                                    onClick={() => {
                                                                        setSelectedUser(user);
                                                                        setOpenAddUser(true);
                                                                    }}
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    sx={{ color: 'rgba(248, 113, 113, 0.8)' }}
                                                                    onClick={() => handleDeleteUser(user.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </IconButton>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                            )}
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
                                                    <span className="font-mono tracking-wider">{card.numero_tarjeta}</span>
                                                </TableCell>
                                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    {card.documentNumber}
                                                </TableCell>
                                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    {new Date(card.fecha_asignacion).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    {new Date(card.fecha_vencimiento).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <Chip
                                                        label={card.activo ? 'Activa' : 'Bloqueada'}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: card.activo ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                                                            color: card.activo ? '#4ade80' : '#f87171',
                                                            border: `1px solid ${card.activo ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <div className="flex items-center gap-2">
                                                        <IconButton
                                                            size="small"
                                                            sx={{ color: card.activo ? '#f87171' : '#4ade80' }}
                                                            onClick={() => handleToggleCardStatus(card.id)}
                                                        >
                                                            {card.activo ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                        </IconButton>
                                                        <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                            <Edit className="w-4 h-4" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            sx={{ color: 'rgba(248, 113, 113, 0.8)' }}
                                                            onClick={() => handleDeleteCard(card.id)}
                                                        >
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
            {/* Dialog: Add User */}
            <AddUserDialog
                open={openAddUser}
                onClose={() => {
                    setOpenAddUser(false);
                    setSelectedUser(null);
                }}
                onRegister={handleHandleAddUser}
                initialData={selectedUser ? {
                    documentType: selectedUser.document_type,
                    documentNumber: selectedUser.document_number,
                    firstName: selectedUser.full_name.split(' ')[0],
                    lastName: selectedUser.full_name.split(' ').slice(1).join(' '),
                    phone: selectedUser.phone,
                    email: selectedUser.email,
                } : null}
            />

            {/* Dialog: Assign Card */}
            <AssignCardDialog
                open={openAssignCard}
                onClose={() => {
                    setOpenAssignCard(false);
                    setSelectedUser(null);
                }}
                onAssign={handleHandleAssignCard}
                selectedUser={selectedUser}
            />
        </div >
    );
}