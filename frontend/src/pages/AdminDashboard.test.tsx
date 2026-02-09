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
  Box,
} from '@mui/material';
import {
  Users,
  CreditCard,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  UserPlus,
} from 'lucide-react';

import { DashboardHeader } from '../components/DashboardHeader';
import { DashboardStats } from '../components/DashboardStats';
import { AddUserDialog } from '../components/AddUserDialog';
import { AssignCardDialog } from '../components/AssignCardDialog';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface CardItem {
  id: number;
  numero_tarjeta: string;
  saldo: number;
  fecha_asignacion: string;
  fecha_vencimiento: string | null;
  activo: boolean;
}

interface UserApi {
  id: number;
  full_name: string;
  email: string;
  document_type: string;
  document_number: string;
  phone: string | null;
  status: 'active' | 'inactive' | 'pending';
  registration_date: string;
  has_card: boolean;
  balance: string; // viene como string desde backend
  rol: boolean;
  cards_count: number;
  cards: CardItem[];
}

// ====== Helpers API (Auth + Refresh) ======
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

function getAccess() {
  return localStorage.getItem('access') || '';
}
function getRefresh() {
  return localStorage.getItem('refresh') || '';
}

async function tryRefreshToken(): Promise<string | null> {
  const refresh = getRefresh();
  if (!refresh) return null;

  const payload = JSON.stringify({ refresh });

  // 1) intenta tu ruta custom
  try {
    const r1 = await fetch(`${API_URL}/api/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });

    if (r1.ok) {
      const j = await r1.json();
      const newAccess = j?.access || j?.data?.access;
      if (newAccess) {
        localStorage.setItem('access', newAccess);
        return newAccess;
      }
    }
  } catch {
    // ignore
  }

  // 2) fallback a SimpleJWT default
  try {
    const r2 = await fetch(`${API_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });

    if (r2.ok) {
      const j = await r2.json();
      const newAccess = j?.access;
      if (newAccess) {
        localStorage.setItem('access', newAccess);
        return newAccess;
      }
    }
  } catch {
    // ignore
  }

  return null;
}

async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  const access = getAccess();
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> | undefined),
  };

  if (!headers['Content-Type'] && init?.method && init.method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  if (access) headers.Authorization = `Bearer ${access}`;

  let res = await fetch(input, { ...init, headers });

  // Si expira token: intenta refresh una vez y reintenta
  if (res.status === 401) {
    const newAccess = await tryRefreshToken();
    if (newAccess) {
      const headers2 = { ...headers, Authorization: `Bearer ${newAccess}` };
      res = await fetch(input, { ...init, headers: headers2 });
    }
  }

  return res;
}

function safeJson<T = any>(text: string): T | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentTab, setCurrentTab] = useState(0);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openAssignCard, setOpenAssignCard] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserApi | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [users, setUsers] = useState<UserApi[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  async function loadUsers() {
    setIsLoadingUsers(true);
    try {
      const res = await apiFetch(`${API_URL}/api/admin/users-cards/?page=1&page_size=100`, {
        method: 'GET',
      });

      const text = await res.text();
      const data = safeJson<any>(text);

      if (!res.ok || !data?.success) {
        console.error('Error cargando usuarios:', res.status, text);
        return;
      }

      setUsers(Array.isArray(data.data) ? (data.data as UserApi[]) : []);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;

    return users.filter(
      (u) =>
        (u.full_name || '').toLowerCase().includes(term) ||
        (u.email || '').toLowerCase().includes(term) ||
        (u.document_number || '').includes(term)
    );
  }, [users, searchTerm]);

  // Tarjetas derivadas del endpoint (sin mock)
  const cardsFromApi = useMemo(() => {
    return users.flatMap((u) =>
      (u.cards || []).map((c) => ({
        id: c.id,
        userName: u.full_name,
        documentNumber: `${u.document_type}-${u.document_number}`,
        cardNumber: c.numero_tarjeta,
        status: c.activo ? ('active' as const) : ('blocked' as const),
        expiryDate: c.fecha_vencimiento || '',
        assignedDate: c.fecha_asignacion,
        limit: 0, // tu backend aún no manda límite
      }))
    );
  }, [users]);

  const stats = useMemo(() => {
    const totalBalance = users.reduce((sum, u) => sum + (Number(u.balance) || 0), 0);
    return {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.status === 'active').length,
      totalCards: cardsFromApi.length,
      activeCards: cardsFromApi.filter((c) => c.status === 'active').length,
      totalBalance,
    };
  }, [users, cardsFromApi]);

  // ===== CRUD USERS =====

  // AddUserDialog te entrega algo tipo:
  // { documentType, documentNumber, firstName, lastName, phone, email, password? }
  const handleHandleAddUser = async (userData: any) => {
    try {
      const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();

      // Si estoy editando, hago PATCH al admin endpoint
      if (selectedUser) {
        const payload: any = {};
        if (userData.documentType !== undefined) payload.document_type = userData.documentType;
        if (userData.documentNumber !== undefined) payload.document_number = userData.documentNumber;
        if (fullName) payload.full_name = fullName;
        if (userData.phone !== undefined) payload.phone = userData.phone;
        if (userData.email !== undefined) payload.email = userData.email;
        // opcional: status/rol si los agregas en el dialog
        if (userData.status) payload.status = userData.status;
        if (typeof userData.rol === 'boolean') payload.rol = userData.rol;

        const res = await apiFetch(`${API_URL}/api/admin/users/${selectedUser.id}/`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });

        const text = await res.text();
        const data = safeJson<any>(text);

        if (!res.ok || !data?.success) {
          console.error('Error editando usuario:', res.status, text);
          alert(data?.message || 'No se pudo editar el usuario (revisa consola).');
          return;
        }

        setOpenAddUser(false);
        setSelectedUser(null);
        await loadUsers();
        return;
      }

      // Si NO estoy editando, registro (POST)
      const payload = {
        document_type: userData.documentType,
        document_number: userData.documentNumber,
        full_name: fullName,
        phone: userData.phone || null,
        email: userData.email,
        password: userData.password || 'User12345!',
      };

      const res = await apiFetch(`${API_URL}/api/auth/register/`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      const data = safeJson<any>(text);

      if (!res.ok || data?.success === false) {
        console.error('Error registrando usuario:', res.status, text);
        alert(data?.message || 'No se pudo registrar el usuario (revisa consola).');
        return;
      }

      setOpenAddUser(false);
      setSelectedUser(null);
      await loadUsers();
    } catch (err) {
      console.error('Error registrando/editando usuario:', err);
      alert('Error de red (revisa consola).');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('¿Seguro que deseas desactivar este usuario?')) return;

    try {
      const res = await apiFetch(`${API_URL}/api/admin/users/${userId}/`, {
        method: 'DELETE',
      });

      const text = await res.text();
      const data = safeJson<any>(text);

      if (!res.ok || !data?.success) {
        console.error('Error desactivando usuario:', res.status, text);
        alert(data?.message || 'No se pudo desactivar el usuario (revisa consola).');
        return;
      }

      await loadUsers();
    } catch (err) {
      console.error('Error desactivando usuario:', err);
      alert('Error de red desactivando usuario.');
    }
  };

  // (Luego conectamos asignación de tarjeta al backend)
  const handleHandleAssignCard = async (_cardData: any) => {
    setOpenAssignCard(false);
    setSelectedUser(null);
    // cuando exista endpoint real:
    // await apiFetch(`${API_URL}/api/admin/...`, {method:'POST', body:...})
    // await loadUsers();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black">
      <DashboardHeader onLogout={onLogout} subtitle="Panel de Administración" userInitials="AD" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats stats={stats} />

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
                  '&.Mui-selected': { color: '#d3ba30' },
                },
                '& .MuiTabs-indicator': { backgroundColor: '#d3ba30' },
              }}
            >
              <Tab icon={<Users className="w-5 h-5" />} iconPosition="start" label="Usuarios Registrados" />
              <Tab icon={<CreditCard className="w-5 h-5" />} iconPosition="start" label="Tarjetas Virtuales" />
            </Tabs>
          </Box>

          {/* TAB 1 */}
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
                    '&:hover': { backgroundColor: '#b39928' },
                  }}
                >
                  Registrar Usuario
                </Button>
              </div>

              {isLoadingUsers && <div className="text-white/60 mb-4">Cargando usuarios...</div>}

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        Usuario
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        Documento
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        Contacto
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        Balance
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        Tarjeta
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        Acciones
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <div className="flex items-center gap-3">
                            <Avatar sx={{ backgroundColor: '#d3ba30', color: '#000', width: 36, height: 36 }}>
                              {user.full_name?.charAt(0) || 'U'}
                            </Avatar>
                            <div>
                              <p className="text-white">{user.full_name}</p>
                              <p className="text-white/40 text-xs">{user.registration_date}</p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          {user.document_type}-{user.document_number}
                        </TableCell>

                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <div>
                            <p className="text-white text-sm">{user.email}</p>
                            <p className="text-white/40 text-xs">{user.phone ?? ''}</p>
                          </div>
                        </TableCell>

                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          ${Number(user.balance || 0).toLocaleString()}
                        </TableCell>

                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
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
                                '&:hover': { backgroundColor: 'rgba(248, 113, 113, 0.2)' },
                              }}
                              onClick={() => {
                                setSelectedUser(user);
                                setOpenAssignCard(true);
                              }}
                            />
                          )}
                        </TableCell>

                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
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
                                setOpenAddUser(true); // reusa el mismo dialog para editar
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
            </CardContent>
          )}

          {/* TAB 2 */}
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
                    '&:hover': { backgroundColor: '#b39928' },
                  }}
                >
                  Asignar Tarjeta
                </Button>
              </div>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        Titular
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        Número de Tarjeta
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        Documento
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        Límite
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        Fecha Asignación
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        Vencimiento
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        Estado
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        Acciones
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {cardsFromApi.map((card) => (
                      <TableRow key={card.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <div className="flex items-center gap-3">
                            <Avatar sx={{ backgroundColor: '#d3ba30', color: '#000', width: 36, height: 36 }}>
                              {card.userName?.charAt(0) || 'U'}
                            </Avatar>
                            <p className="text-white">{card.userName}</p>
                          </div>
                        </TableCell>

                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <span className="font-mono tracking-wider">{card.cardNumber}</span>
                        </TableCell>

                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          {card.documentNumber}
                        </TableCell>

                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <span className="text-[#d3ba30]">${Number(card.limit || 0).toLocaleString()}</span>
                        </TableCell>

                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          {card.assignedDate}
                        </TableCell>

                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          {card.expiryDate}
                        </TableCell>

                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <Chip
                            label={card.status === 'active' ? 'Activa' : 'Bloqueada'}
                            size="small"
                            sx={{
                              backgroundColor: card.status === 'active' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                              color: card.status === 'active' ? '#4ade80' : '#f87171',
                              border: `1px solid ${
                                card.status === 'active'
                                  ? 'rgba(74, 222, 128, 0.3)'
                                  : 'rgba(248, 113, 113, 0.3)'
                              }`,
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <div className="flex items-center gap-2">
                            {/* Acciones de tarjeta: conéctalas luego a endpoints de Card */}
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

      {/* Dialog Register/Edit */}
      <AddUserDialog
        open={openAddUser}
        onClose={() => {
          setOpenAddUser(false);
          setSelectedUser(null);
        }}
        onRegister={handleHandleAddUser}
        initialData={
          selectedUser
            ? {
                documentType: selectedUser.document_type,
                documentNumber: selectedUser.document_number,
                firstName: selectedUser.full_name.split(' ')[0] || '',
                lastName: selectedUser.full_name.split(' ').slice(1).join(' ') || '',
                phone: selectedUser.phone || '',
                email: selectedUser.email || '',
              }
            : null
        }
      />

      {/* Dialog Assign Card */}
      <AssignCardDialog
        open={openAssignCard}
        onClose={() => {
          setOpenAssignCard(false);
          setSelectedUser(null);
        }}
        onAssign={handleHandleAssignCard}
        selectedUser={selectedUser}
      />
    </div>
  );
}
