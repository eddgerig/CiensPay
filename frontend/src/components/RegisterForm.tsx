import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, InputAdornment, IconButton, Box, type SxProps, type Theme } from '@mui/material';
import { Eye, EyeOff, User, Mail, Phone, CreditCard, Lock, CheckCircle, Check, X } from 'lucide-react';


export interface RegisterFormData {
    documentType: string;
    documentNumber: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
    balance?: string;
}

interface RegisterFormProps {
    onBack?: () => void;
    onRegisterSuccess?: () => void;
    embedded?: boolean;
    hidePassword?: boolean;
    initialData?: Partial<RegisterFormData>;
    onSubmit?: (data: RegisterFormData) => void;
    sx?: SxProps<Theme>;
    submitLabel?: string;
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
    balance?: string;
}

export function RegisterForm({ onBack, onRegisterSuccess, embedded = false, hidePassword = false, initialData, onSubmit, sx, submitLabel }: RegisterFormProps) {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<RegisterFormData>({
        documentType: initialData?.documentType || 'V',
        documentNumber: initialData?.documentNumber || '',
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        password: '',
        confirmPassword: '',
        balance: initialData?.balance || '0.00',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                documentType: initialData.documentType || 'V',
                documentNumber: initialData.documentNumber || '',
                firstName: initialData.firstName || '',
                lastName: initialData.lastName || '',
                phone: initialData.phone || '',
                email: initialData.email || '',
                balance: initialData.balance || '0.00',
            }));
        }
    }, [initialData]);

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

        // Balance (optional for edit mode)
        if (formData.balance !== undefined && formData.balance !== '') {
            const balanceNum = parseFloat(formData.balance);
            if (isNaN(balanceNum)) {
                newErrors.balance = 'Balance inválido';
                hasErrors = true;
            } else if (balanceNum < 0) {
                newErrors.balance = 'El balance no puede ser negativo';
                hasErrors = true;
            }
        }

        if (!hidePassword) {
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
        }

        setErrors(newErrors);
        return !hasErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (onSubmit) {
            onSubmit(formData);
            return;
        }

        setIsLoading(true);

        try {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';

            // Backend actual espera: nombre, email, edad, password, password2
            const payload = {
                full_name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email.trim().toLowerCase(),
                document_type: formData.documentType,
                //edad: 18, // <-- TEMPORAL: agrega campo "edad" en el form si lo quieres real
                password: formData.password,
                password2: formData.confirmPassword,
                document_number: formData.documentNumber,
            };

            const res = await fetch(`${apiBase}/auth/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok || !data?.success) {
                // El backend devuelve { success:false, errors:{...} }
                const be = data?.errors || {};
                const msg = data?.message || 'No se pudo registrar';

                setErrors({
                    documentNumber: '', // backend no valida esto aún
                    firstName: be?.nombre?.[0] || '',
                    lastName: '', // backend no separa apellido
                    phone: '', // backend no valida esto aún
                    email: be?.email?.[0] || '',
                    password: be?.password?.[0] || be?.non_field_errors?.[0] || msg,
                    confirmPassword: be?.password2?.[0] || '',
                });

                setIsLoading(false);
                return;
            }

            setIsLoading(false);
            if (onRegisterSuccess) onRegisterSuccess();
        } catch (err) {
            setIsLoading(false);
            setErrors((prev) => ({
                ...prev,
                password: 'Error de red: no se pudo conectar al servidor',
            }));
        }
    };


    const handleChange = (field: keyof RegisterFormData) => (
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
                fontSize: '0.8rem',
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

    const content = (
        <Box component="form" onSubmit={handleSubmit} className="space-y-6" sx={sx}>
            {/* Document Type and Number */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
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
                    placeholder=""
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

            {/* Balance (only show in edit mode) */}
            {initialData && (
                <div className="grid md:grid-cols-2 gap-6">
                    <TextField
                        fullWidth
                        label="Balance"
                        value={formData.balance}
                        onChange={handleChange('balance')}
                        error={!!errors.balance}
                        helperText={errors.balance || 'Balance disponible del usuario'}
                        placeholder="0.00"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <span style={{ color: '#d3ba30', fontSize: '16px', fontWeight: 'bold' }}>$</span>
                                </InputAdornment>
                            ),
                        }}
                        sx={inputStyles}
                    />
                </div>
            )}

            {/* Passwords */}
            {!hidePassword && (
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
            )}

            {/* Password Requirements */}
            {!hidePassword && isPasswordFocused && (
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
                {isLoading ? 'Procesando...' : (submitLabel || 'Crear Cuenta')}
            </Button>
        </Box>
    );

    if (embedded) {
        return content;
    }

    return (
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

            {content}

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
    );
}
