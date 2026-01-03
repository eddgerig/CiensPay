import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, InputAdornment, IconButton } from '@mui/material';
import { Eye, EyeOff, ArrowLeft, User, Mail, Phone, CreditCard, Lock, CheckCircle, Check, X } from 'lucide-react';

interface RegisterProps {
    onBack: () => void;
    onRegisterSuccess: () => void;
}

interface FormData {
    documentType: string;
    documentNumber: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    documentType?: string;
    documentNumber?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export function Register({ onBack, onRegisterSuccess }: RegisterProps) {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        documentType: 'V',
        documentNumber: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^[0-9]{10,11}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        let hasErrors = false;

        // Document Number
        if (!formData.documentNumber) {
            newErrors.documentNumber = 'La cédula es requerida';
            hasErrors = true;
        } else if (!/^[0-9]{7,8}$/.test(formData.documentNumber)) {
            newErrors.documentNumber = 'Cédula inválida (7-8 dígitos)';
            hasErrors = true;
        }

        // First Name
        if (!formData.firstName) {
            newErrors.firstName = 'El nombre es requerido';
            hasErrors = true;
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = 'Nombre muy corto';
            hasErrors = true;
        }

        // Last Name
        if (!formData.lastName) {
            newErrors.lastName = 'El apellido es requerido';
            hasErrors = true;
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = 'Apellido muy corto';
            hasErrors = true;
        }

        // Phone
        if (!formData.phone) {
            newErrors.phone = 'El teléfono es requerido';
            hasErrors = true;
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Teléfono inválido (10-11 dígitos)';
            hasErrors = true;
        }

        // Email
        if (!formData.email) {
            newErrors.email = 'El email es requerido';
            hasErrors = true;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Email inválido';
            hasErrors = true;
        }

        // Password
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
            hasErrors = true;
        } else if (formData.password.length < 8) {
            newErrors.password = 'Mínimo 8 caracteres';
            hasErrors = true;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
            newErrors.password = 'Debe incluir mayúscula, minúscula y número';
            hasErrors = true;
        }

        // Confirm Password
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirma tu contraseña';
            hasErrors = true;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
            hasErrors = true;
        }

        setErrors(newErrors);
        return !hasErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onRegisterSuccess();
        }, 2000);
    };

    const handleChange = (field: keyof FormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
    ) => {
        setFormData({
            ...formData,
            [field]: e.target.value,
        });
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: undefined,
            });
        }
    };

    const inputStyles = {
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
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden py-12">
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

            <div className="relative w-full max-w-2xl px-4">
                {/* Back button */}
                <button
                    onClick={onBack}
                    className="absolute -top-16 left-4 flex items-center gap-2 text-white/60 hover:text-primary transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Volver</span>
                </button>



                {/* Register Card */}
                <div
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(40px)',
                        WebkitBackdropFilter: 'blur(40px)',
                        border: '1px solid rgba(211, 186, 48, 0.2)',
                        borderRadius: '1rem',
                        padding: '2.5rem',
                        position: 'relative',

                    }}
                >
                    {/* Close button */}
                    <button
                        onClick={() => navigate('/')}
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

                    <h3 style={{ color: '#d3ba30' }} className="text-2xl text-white text-center mb-8 ">Crear Cuenta</h3>



                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Document Type and Number */}
                        {/* Document Type and Number */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormControl fullWidth sx={inputStyles}>
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    value={formData.documentType}
                                    onChange={handleChange('documentType')}
                                    label="Tipo"
                                    sx={{
                                        color: 'white',
                                        padding: '4px 14px',
                                        '& .MuiSelect-select': {
                                            padding: '4px 0',
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: '#d3ba30',
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: '#1a1a1a',
                                                border: '1px solid rgba(211, 186, 48, 0.3)',
                                                '& .MuiMenuItem-root': {
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(211, 186, 48, 0.1)',
                                                    },
                                                    '&.Mui-selected': {
                                                        backgroundColor: 'rgba(211, 186, 48, 0.2)',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(211, 186, 48, 0.3)',
                                                        },
                                                    },
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

                            <TextField
                                fullWidth
                                label="Cédula"
                                value={formData.documentNumber}
                                onChange={handleChange('documentNumber')}
                                error={!!errors.documentNumber}
                                helperText={errors.documentNumber}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CreditCard style={{ color: '#d3ba30', width: '16px', height: '16px' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={inputStyles}
                            />
                        </div>

                        {/* Name Fields */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <TextField
                                fullWidth
                                label="Nombre"
                                value={formData.firstName}
                                onChange={handleChange('firstName')}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <User style={{ color: '#d3ba30', width: '16px', height: '16px' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={inputStyles}
                            />

                            <TextField
                                fullWidth
                                label="Apellido"
                                value={formData.lastName}
                                onChange={handleChange('lastName')}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <User style={{ color: '#d3ba30', width: '16px', height: '16px' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={inputStyles}
                            />
                        </div>

                        {/* Phone and Email */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <TextField
                                fullWidth
                                label="Teléfono"
                                value={formData.phone}
                                onChange={handleChange('phone')}
                                error={!!errors.phone}
                                helperText={errors.phone}
                                placeholder="04241234567"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Phone style={{ color: '#d3ba30', width: '16px', height: '16px' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={inputStyles}
                            />

                            <TextField
                                fullWidth
                                type="email"
                                label="Email"
                                value={formData.email}
                                onChange={handleChange('email')}
                                error={!!errors.email}
                                helperText={errors.email}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Mail style={{ color: '#d3ba30', width: '16px', height: '16px' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={inputStyles}
                            />
                        </div>

                        {/* Passwords */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <TextField
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                label="Contraseña"
                                value={formData.password}
                                onChange={handleChange('password')}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
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
                                                {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={inputStyles}
                            />

                            <TextField
                                fullWidth
                                type={showConfirmPassword ? 'text' : 'password'}
                                label="Repetir Contraseña"
                                value={formData.confirmPassword}
                                onChange={handleChange('confirmPassword')}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CheckCircle style={{ color: '#d3ba30', width: '16px', height: '16px' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                                sx={{ color: '#d3ba30' }}
                                            >
                                                {showConfirmPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={inputStyles}
                            />
                        </div>

                        {/* Password Requirements */}
                        {isPasswordFocused && (
                            <div className="p-6 bg-primary/10 border border-primary/30 rounded-lg">
                                <p className="text-primary text-sm mb-2">Requisitos de contraseña:</p>
                                <ul className="space-y-1">
                                    {[
                                        { label: 'Mínimo 8 caracteres', valid: formData.password.length >= 8 },
                                        { label: 'Al menos una letra minúscula', valid: /(?=.*[a-z])/.test(formData.password) },
                                        { label: 'Al menos una letra mayúscula', valid: /(?=.*[A-Z])/.test(formData.password) },
                                        { label: 'Al menos un número', valid: /(?=.*[0-9])/.test(formData.password) },
                                    ].map((req, index) => (
                                        <li key={index} className={`flex items-center gap-2 text-xs ${req.valid ? 'text-green-400' : 'text-white/60'}`}>
                                            {req.valid ? (
                                                <Check className="w-3 h-3" />
                                            ) : (
                                                <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                                            )}
                                            {req.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{
                                backgroundColor: '#d3ba30',
                                color: '#000000',
                                padding: '10px',
                                fontSize: '1rem',
                                textTransform: 'none',
                                marginTop: '5px',
                                marginBottom: '15px',
                                '&:hover': {
                                    backgroundColor: '#b39928',
                                },
                                '&.Mui-disabled': {
                                    backgroundColor: 'rgba(211, 186, 48, 0.3)',
                                    color: 'rgba(0, 0, 0, 0.5)',
                                },
                            }}
                        >
                            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </Button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-white/60">
                            ¿Ya tienes cuenta?{' '}
                            <button onClick={onBack} className="text-primary hover:underline">
                                Inicia sesión
                            </button>
                        </p>
                    </div>
                </div>


            </div>
        </div>
    );
}
