import { useEffect, useMemo, useState } from 'react';
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
    Box
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
import usersData from '../data/users.json';
import virtualCardsData from '../data/virtualCards.json';

import { userAPI } from '../api/user';

interface AdminDashboardProps {
    onLogout: () => void;
}

interface User {
    id: number;
    documentType: string;
    documentNumber: string;
    nombre: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'pending';
    registrationDate: string;
    hasCard: boolean;
    balance: number;
}
/*interface User {
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
}*/

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

    
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    // Mock data - usuarios registrados
    //const [users, setUsers] = useState<User[]>(usersData as User[]);
    const [users, setUsers] = useState<User[]>([]);


    useEffect(() => {
        async function loadData(){

            try {
                  const response = await userAPI.getUserAll();;
                  console.log('Usuarios:', response);
                  
                if (response.data.data) {
                    console.log('Usuarios:', response.data.data);
                // Si fetchMe devuelve un solo usuario, lo pones en un array
                    setUsers([response.data.data]);
                } else {
                    //setError('No se pudo obtener el usuario');
                }
                
            } catch (err) {
                //setError('Error de conexión con el servidor');
                console.error('Error:', err);
            } finally {
                //setLoading(false);
            }
        }
        loadData();
    }, []);
    
    const [cards, setCards] = useState<VirtualCard[]>(virtualCardsData as VirtualCard[]);

    // Form state for new user
    // Managed in AddUserDialog

    // Form state for assign card
    // Managed in AssignCardDialog

    /*const filteredUsers = users.filter(user =>
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.documentNumber.includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
*/

// Reemplaza tu useEffect del filtro por este:
useEffect(() => {
  console.log('🔄 Ejecutando filtro...');
  console.log('👥 Total usuarios:', users.length);
  console.log('🔍 Término de búsqueda:', searchTerm);
  
  if (users.length > 0) {
    console.log('✅ Hay usuarios para filtrar');
    
    const filtered = users.filter(user => {
      // Validación completa
      if (!user || typeof user !== 'object') {
        console.warn('⚠️ Usuario inválido encontrado:', user);
        return false;
      }
      
      // Obtener valores con múltiples posibles nombres
      const nombre = user.nombre || '';
      const documentNumber = user.documentNumber  || '';
      const email = user.email  || '';
      
      const search = searchTerm.toLowerCase();
      
      // Si no hay término de búsqueda, incluir todos
      if (!search.trim()) {
        return true;
      }
      
      // Convertir a string y validar
      const nombreStr = String(nombre).toLowerCase();
      const docStr = String(documentNumber).toLowerCase();
      const emailStr = String(email).toLowerCase();
      
      return (
        nombreStr.includes(search) ||
        docStr.includes(search) ||
        emailStr.includes(search)
      );
    });
    
    console.log('🎯 Usuarios filtrados encontrados:', filtered.length);
    setFilteredUsers(filtered);
  } else {
    console.log('📭 No hay usuarios para filtrar');
    setFilteredUsers([]);
  }
}, [users, searchTerm]);

    const stats = {
        totalUsers: users.length,
        activeUsers: users.length,
        totalCards: cards.length,
        activeCards: cards.filter(c => c.status === 'active').length,
        totalBalance: users.reduce((sum, u) => sum + u.balance, 0),
    };


    const handleHandleAddUser = (userData: any) => {
        // Aquí iría la lógica para agregar usuario
        console.log('Nuevo usuario:', userData);
        setOpenAddUser(false);
    };

    const handleHandleAssignCard = (cardData: { documentNumber: string; limit: number }) => {
        setUsers(prevUsers => prevUsers.map(user => {
            if (user.documentNumber === cardData.documentNumber) {
                return { ...user, hasCard: true, status: 'active' };
            }
            return user;
        }));
        setOpenAssignCard(false);
    };

    const handleToggleCardStatus = (cardId: number) => {
        setCards(prevCards => prevCards.map(card => {
            if (card.id === cardId) {
                return { ...card, status: card.status === 'active' ? 'blocked' : 'active' };
            }
            return card;
        }));
    };

    const handleDeleteCard = (cardId: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta tarjeta?')) {
            setCards(prevCards => prevCards.filter(card => card.id !== cardId));
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
                                        {filteredUsers.length > 0 && filteredUsers.map((user) => (
                                            console.log('Render'),
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
                                                            {user.nombre.charAt(0)}
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-white">{user.nombre}</p>
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
                                                            sx={{ color: card.status === 'active' ? '#f87171' : '#4ade80' }}
                                                            onClick={() => handleToggleCardStatus(card.id)}
                                                        >
                                                            {card.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
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
                    documentType: selectedUser.documentType,
                    documentNumber: selectedUser.documentNumber,
                    firstName: selectedUser.fullName.split(' ')[0],
                    lastName: selectedUser.fullName.split(' ').slice(1).join(' '),
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