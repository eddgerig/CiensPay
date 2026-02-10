import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    TextField,
    Button,
    InputAdornment,
    Snackbar,
    Alert,
    CircularProgress,

} from '@mui/material';
import {
    CreditCard,
    Calendar,
    Lock,
    User,
    ArrowLeft,
    ShoppingCart,
} from 'lucide-react';

export function PaymentButton() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        amount: '',
    });

    const handleInputChange = (field: string, value: string) => {
        let formattedValue = value;

        // Format card number with spaces every 4 digits
        if (field === 'cardNumber') {
            formattedValue = value
                .replace(/\s/g, '')
                .replace(/(\d{4})/g, '$1 ')
                .trim()
                .slice(0, 19); // 16 digits + 3 spaces
        }

        // Format expiry date as MM/YY
        if (field === 'expiryDate') {
            formattedValue = value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d{0,2})/, '$1/$2')
                .slice(0, 5);
        }

        // Limit CVV to 3 digits
        if (field === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 3);
        }

        // Format amount with decimal
        if (field === 'amount') {
            formattedValue = value.replace(/[^\d.]/g, '');
        }

        setFormData({ ...formData, [field]: formattedValue });
    };

    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/transactions/simulate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    card_number: formData.cardNumber,
                    expiry_date: formData.expiryDate,
                    cvv: formData.cvv,
                    amount: formData.amount,
                    description: 'Compra en Tienda Demo',
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSnackbar({
                    open: true,
                    message: data.message || 'Pago realizado con éxito',
                    severity: 'success',
                });
                // Optional: Clear form or redirect
                setFormData({
                    cardNumber: '',
                    cardHolder: '',
                    expiryDate: '',
                    cvv: '',
                    amount: '',
                });
            } else {
                setSnackbar({
                    open: true,
                    message: data.error || 'Error al procesar el pago',
                    severity: 'error',
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error de conexión con el servidor',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black">
            {/* Header */}
            <div className="bg-black/50 border-b border-[#d3ba30]/20 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-[#d3ba30] transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <img
                                src="/log_dorado.png"
                                alt="CiensPay Logo"
                                className="w-8 h-8 object-contain"
                            />
                            <div>
                                <h1 className="text-xl font-bold text-white">Botón de Pago</h1>
                                <p className="text-xs text-white/40">Simulador de Comercio</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Purchase Summary */}
                    <div>
                        <Card
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(211, 186, 48, 0.2)',
                                borderRadius: '20px',
                                marginBottom: '24px',
                            }}
                        >
                            <CardContent sx={{ padding: '32px' }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <ShoppingCart className="w-6 h-6 text-[#d3ba30]" />
                                    <h2 className="text-xl font-bold text-white">Resumen de Compra</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                                        <span className="text-white/60">Comercio</span>
                                        <span className="text-white font-semibold">Tienda Demo</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                                        <span className="text-white/60">Producto</span>
                                        <span className="text-white font-semibold">Compra Simulada</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-white/60">Monto a Pagar</span>
                                        <span className="text-[#d3ba30] text-2xl font-bold">
                                            ${formData.amount || '0.00'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Payment Form */}
                    <div>
                        <Card
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(211, 186, 48, 0.2)',
                                borderRadius: '20px',
                            }}
                        >
                            <CardContent sx={{ padding: '32px' }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <CreditCard className="w-6 h-6 text-[#d3ba30]" />
                                    <h2 className="text-xl font-bold text-white">Datos de Pago</h2>
                                </div>

                                <form onSubmit={handlePayment} className="space-y-4">
                                    {/* Amount */}
                                    <TextField
                                        label="Monto"
                                        fullWidth
                                        value={formData.amount}
                                        onChange={(e) => handleInputChange('amount', e.target.value)}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <span className="text-[#d3ba30]">$</span>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: '#fff',
                                                padding: '2px 4px',
                                                '& input': {
                                                    padding: '8px 8px',
                                                },
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
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#d3ba30',
                                            },
                                            marginBottom: '20px',
                                        }}
                                    />

                                    {/* Card Number */}
                                    <TextField
                                        label="Número de Tarjeta"
                                        fullWidth
                                        value={formData.cardNumber}
                                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                        placeholder="1234 5678 9012 3456"
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CreditCard className="w-5 h-5 text-[#d3ba30]" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: '#fff',
                                                fontFamily: 'monospace',
                                                letterSpacing: '0.05em',
                                                padding: '4px 8px',
                                                '& input': {
                                                    padding: '8px 8px',
                                                },
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
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#d3ba30',
                                            },
                                            marginBottom: '20px',
                                        }}
                                    />

                                    {/* Card Holder */}
                                    <TextField
                                        label="Titular de la Tarjeta"
                                        fullWidth
                                        value={formData.cardHolder}
                                        onChange={(e) => handleInputChange('cardHolder', e.target.value.toUpperCase())}
                                        placeholder="Nombre y Apellido"
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <User className="w-5 h-5 text-[#d3ba30]" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: '#fff',
                                                textTransform: 'uppercase',
                                                padding: '4px 8px',
                                                '& input': {
                                                    padding: '8px 8px',
                                                },
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
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#d3ba30',
                                            },
                                            marginBottom: '20px',
                                        }}
                                    />

                                    {/* Expiry and CVV */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <TextField
                                            label="Vencimiento"
                                            value={formData.expiryDate}
                                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                            placeholder="MM/YY"
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Calendar className="w-5 h-5 text-[#d3ba30]" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    color: '#fff',
                                                    fontFamily: 'monospace',
                                                    padding: '4px 8px',
                                                    '& input': {
                                                        padding: '8px 8px',
                                                    },
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
                                                },
                                                '& .MuiInputLabel-root.Mui-focused': {
                                                    color: '#d3ba30',
                                                },
                                                marginBottom: '20px',
                                            }}
                                        />

                                        <TextField
                                            label="CVV"
                                            value={formData.cvv}
                                            onChange={(e) => handleInputChange('cvv', e.target.value)}
                                            placeholder="123"
                                            type="password"
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock className="w-5 h-5 text-[#d3ba30]" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    color: '#fff',
                                                    fontFamily: 'monospace',
                                                    padding: '4px 8px',
                                                    '& input': {
                                                        padding: '8px 8px',
                                                    },
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
                                                },
                                                '& .MuiInputLabel-root.Mui-focused': {
                                                    color: '#d3ba30',
                                                },
                                            }}
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            backgroundColor: '#d3ba30',
                                            color: '#000',
                                            padding: '16px',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            textTransform: 'none',
                                            borderRadius: '12px',
                                            marginTop: '24px',
                                            '&:hover': {
                                                backgroundColor: '#b39928',
                                                boxShadow: '0 8px 24px rgba(211, 186, 48, 0.3)',
                                            },
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : `Pagar $${formData.amount || '0.00'}`}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </div>
    );
}
