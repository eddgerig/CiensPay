import { useState } from 'react';
import { TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { Eye, EyeOff, X, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    onBack?: () => void;
    onLoginSuccess?: () => void;
}

export function Login({ onBack, onLoginSuccess }: LoginProps) {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        setErrors({ email: '', password: '' });

        // Validate
        let hasErrors = false;
        const newErrors = { email: '', password: '' };

        if (!email) {
            newErrors.email = 'El email es requerido';
            hasErrors = true;
        } else if (!validateEmail(email)) {
            newErrors.email = 'Email inválido';
            hasErrors = true;
        }

        if (!password) {
            newErrors.password = 'La contraseña es requerida';
            hasErrors = true;
        } else if (password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        // login
        setIsLoading(true);
        try {
        const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
        const res = await fetch(`${API_BASE}/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });



        const data = await res.json();

        if (!res.ok || !data.success) {
            // mensaje del backend (401, 400, etc.)
            const msg = data?.message || 'No se pudo iniciar sesión';
            // ponlo en password por simplicidad (o crea error general)
            setErrors({ email: '', password: msg });
            setIsLoading(false);
            return;
        }
        // guardar tokens y user en localStorage
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));

        setIsLoading(false);

        // Admin (si quieres basarte en email)
        if (data.user?.email === 'admin@cienspay.com') {
            navigate('/admin-dashboard');
            return;
        }

        if (onLoginSuccess) onLoginSuccess();
        else navigate('/dashboard');

        } catch (err) {
        setIsLoading(false);
        setErrors({ email: '', password: 'Error de red: no se pudo conectar al servidor' });
        }

    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0" style={{ opacity: 0.1 }}>
                <div
                    style={{
                        position: 'absolute',
                        top: '5rem',
                        left: '2.5rem',
                        width: '24rem',
                        height: '24rem',
                        backgroundColor: '#d3ba30',
                        borderRadius: '9999px',
                        filter: 'blur(64px)'
                    }}
                ></div>
                <div
                    style={{
                        position: 'absolute',
                        bottom: '5rem',
                        right: '2.5rem',
                        width: '24rem',
                        height: '24rem',
                        backgroundColor: '#d3ba30',
                        borderRadius: '9999px',
                        filter: 'blur(64px)'
                    }}
                ></div>
            </div>

            <div className="relative w-full max-w-md px-4">
                {/* Login Card */}
                <div
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(40px)',
                        WebkitBackdropFilter: 'blur(40px)',
                        border: '1px solid rgba(211, 186, 48, 0.2)',
                        borderRadius: '1rem',
                        padding: '2.5rem',
                        position: 'relative'
                    }}
                >
                    {/* Close button */}
                    <button
                        onClick={() => onBack ? onBack() : navigate('/')}
                        className="transition-all hover:opacity-80 hover:rotate-90"
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            color: '#d3ba30',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            zIndex: 10,
                            opacity: 0.5,
                        }}
                    >
                        <X className="w-6 h-6" />
                    </button>
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <img
                            src="/log_dorado.png"
                            alt="CiensPay Logo"
                            style={{
                                width: '3rem',
                                height: '3rem',
                                objectFit: 'contain',
                                animation: 'spin 10s linear infinite'
                            }}
                        />
                        <span style={{ fontSize: '1.875rem', color: '#ffffff' }}>CiensPay</span>
                    </div>

                    <style>{`
                        @keyframes spin {
                            from {
                                transform: rotate(0deg);
                            }
                            to {
                                transform: rotate(360deg);
                            }
                        }
                    `}</style>

                    <h3 style={{ color: '#d3ba30' }} className="text-2xl text-white text-center mb-4 ">Iniciar Sesión</h3>


                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <TextField
                                fullWidth
                                type="email"
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!errors.email}
                                helperText={errors.email}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Mail style={{ color: '#d3ba30', width: '16px', height: '16px' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        padding: '4px 14px',
                                        '& input': {
                                            padding: '4px 0',
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
                                        transform: 'translate(14px, 8px) scale(1)',
                                        '&.MuiInputLabel-shrink': {
                                            transform: 'translate(14px, -9px) scale(0.75)',
                                        },
                                        '&.Mui-focused': {
                                            color: '#d3ba30',
                                        },
                                    },
                                    '& .MuiFormHelperText-root': {
                                        color: '#ff6b6b',
                                    },
                                }}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <TextField
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                label="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!errors.password}
                                helperText={errors.password}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock style={{ color: '#d3ba30', width: '16px', height: '16px' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{ color: '#d3ba30' }}
                                            >
                                                {showPassword ?
                                                    <EyeOff style={{ width: '16px', height: '16px' }} /> :
                                                    <Eye style={{ width: '16px', height: '16px' }} />
                                                }
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        padding: '4px 14px',
                                        '& input': {
                                            padding: '4px 0',
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
                                        transform: 'translate(14px, 8px) scale(1)',
                                        '&.MuiInputLabel-shrink': {
                                            transform: 'translate(14px, -9px) scale(0.75)',
                                        },
                                        '&.Mui-focused': {
                                            color: '#d3ba30',
                                        },
                                    },
                                    '& .MuiFormHelperText-root': {
                                        color: '#ff6b6b',
                                    },
                                }}
                            />
                        </div>


                        {/* Submit Button */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{
                                backgroundColor: '#d3ba30',
                                color: '#000000',
                                padding: '6px',
                                marginBottom: '1rem',
                                fontSize: '0.9  rem',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#b39928',
                                },
                                '&.Mui-disabled': {
                                    backgroundColor: 'rgba(211, 186, 48, 0.3)',
                                    color: 'rgba(0, 0, 0, 0.5)',
                                },
                            }}
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>


                    </form>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-center">

                        <a href="#" className="text-primary text-sm hover:underline">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-8 text-center">
                        <p className="text-white/60">
                            ¿No tienes cuenta?{' '}
                            <button
                                onClick={() => navigate('/register')}
                                className="text-primary hover:underline bg-transparent border-none cursor-pointer"
                                style={{ color: '#d3ba30' }}
                            >
                                Regístrate gratis
                            </button>
                        </p>
                    </div>
                </div>


            </div>
        </div>
    );
}
