import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    InputAdornment,
    Autocomplete,
    CircularProgress,
    Alert
} from '@mui/material';
import { CreditCard } from 'lucide-react';
import { CiensPayCard } from './CiensPayCard';
import type { User } from '../types/user';
import usersData from '../data/users.json';

// Local interface for the JSON data which uses camelCase
interface UserData {
    id: number;
    documentType: string;
    documentNumber: string;
    fullName: string;
    email: string;
}

interface AssignCardDialogProps {
    open: boolean;
    onClose: () => void;
    onAssign: (cardData: { documentNumber: string }) => void;
    selectedUser: User | null;
}

export function AssignCardDialog({ open, onClose, onAssign, selectedUser }: AssignCardDialogProps) {
    const [cardData, setCardData] = useState({
        documentNumber: '',
    });
    const [matchedUser, setMatchedUser] = useState<UserData | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedCard, setGeneratedCard] = useState<string | null>(null);
    const [previewCardNumber, setPreviewCardNumber] = useState<string>('4651 0000 0000 0000');

    // Generate random card number preview with BIN 465100
    const generateRandomCardPreview = () => {
        const BIN = '465100';
        const randomDigits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
        const partial = BIN + randomDigits;

        // Calculate Luhn check digit (simple implementation)
        const digits = partial.split('').map(Number);
        let sum = 0;
        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = digits[i];
            if ((digits.length - i) % 2 === 0) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
        }
        const checkDigit = (10 - (sum % 10)) % 10;

        const fullNumber = partial + checkDigit;
        // Format as XXXX XXXX XXXX XXXX
        return fullNumber.match(/.{1,4}/g)?.join(' ') || fullNumber;
    };

    // Reset or sync state when modal opens or user changes
    useEffect(() => {
        if (open) {
            if (selectedUser) {
                setCardData({
                    documentNumber: selectedUser.document_number, // Changed from documentNumber to document_number
                });
            } else {
                setCardData({
                    documentNumber: '',
                });
            }
            // Reset states
            setLoading(false);
            setError(null);
            setGeneratedCard(null);

            // Start card number animation if user doesn't have a card and not loading
            if (!selectedUser?.has_card && !loading) {
                const interval = setInterval(() => {
                    setPreviewCardNumber(generateRandomCardPreview());
                }, 100); // Change every 100ms

                return () => clearInterval(interval);
            }
        }
    }, [open, selectedUser, loading]);

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '10px 14px',
            '& input': {
                padding: '10px 0',
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
            transform: 'translate(45px, 8px) scale(1)', // Shifted for icon
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

    const handleAssign = async () => {
        setError(null);
        setLoading(true);

        try {
            const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

            // Prepare request data
            const requestData: any = {
                saldo_inicial: 0
            };

            if (selectedUser) {
                requestData.user_id = selectedUser.id;
            } else {
                requestData.document_number = cardData.documentNumber;
            }

            const response = await fetch(`${API_BASE}/cards/generate/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(data.message || 'Error al generar la tarjeta');
                setLoading(false);
                return;
            }

            // Success!
            setGeneratedCard(data.card.numero_tarjeta);
            // Stop animation and show final card number
            setPreviewCardNumber(data.card.numero_tarjeta.match(/.{1,4}/g)?.join(' ') || data.card.numero_tarjeta);
            setLoading(false);

            // Call parent callback immediately to refresh the list
            onAssign({
                documentNumber: selectedUser?.document_number || cardData.documentNumber
            });

        } catch (err: any) {
            setError(err.message || 'Error de red al generar la tarjeta');
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    backgroundColor: '#1a1a1a',
                    backgroundImage: 'none',
                    border: '1px solid rgba(211, 186, 48, 0.2)',
                    borderRadius: '16px',
                    minWidth: '500px',
                    minHeight: '450px',
                },
            }}
        >
            <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '20px' }}>
                Asignar Tarjeta Virtual
            </DialogTitle>
            <DialogContent sx={{ paddingTop: '5px' }}>
                <div className="flex flex-col gap-6">
                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Success Alert */}
                    {generatedCard && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            ¡Tarjeta generada exitosamente! Número: <strong>{generatedCard}</strong>
                        </Alert>
                    )}

                    {selectedUser && (
                        <div className="p-4 bg-white/5 border border-primary/20 rounded-lg">
                            <p className="text-white/60 text-sm mb-1">Usuario seleccionado:</p>
                            <p className="text-white text-lg">{selectedUser.full_name}</p>
                            <p className="text-white/60 text-sm">{selectedUser.document_type}-{selectedUser.document_number}</p>
                        </div>
                    )}

                    {!selectedUser && (
                        <Autocomplete
                            freeSolo
                            options={usersData as UserData[]}
                            getOptionLabel={(option) =>
                                typeof option === 'string' ? option : option.documentNumber
                            }
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    <div className="flex flex-col">
                                        <span className="text-white font-medium">{option.fullName}</span>
                                        <span className="text-white/60 text-sm">
                                            {option.documentType}-{option.documentNumber}
                                        </span>
                                    </div>
                                </li>
                            )}
                            inputValue={inputValue}
                            onInputChange={(_, newInputValue) => {
                                setInputValue(newInputValue);
                                setCardData({ ...cardData, documentNumber: newInputValue });

                                // Find matching user
                                const matched = (usersData as UserData[]).find(
                                    u => u.documentNumber === newInputValue
                                );
                                setMatchedUser(matched || null);
                            }}
                            onChange={(_, newValue) => {
                                if (newValue && typeof newValue !== 'string') {
                                    setCardData({ ...cardData, documentNumber: newValue.documentNumber });
                                    setMatchedUser(newValue);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Cédula del Cliente"
                                    placeholder="Ingrese número de cédula"
                                    sx={{ ...inputStyles, marginTop: '10px' }}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <InputAdornment position="start">
                                                    <CreditCard style={{ color: '#d3ba30', width: '16px', height: '16px' }} />
                                                </InputAdornment>
                                                {params.InputProps.startAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                            slotProps={{
                                paper: {
                                    sx: {
                                        backgroundColor: '#1a1a1a',
                                        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02))',
                                        border: '1px solid rgba(211, 186, 48, 0.3)',
                                        borderRadius: '12px',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(211, 186, 48, 0.1)',
                                        marginTop: '6px',
                                        '& .MuiAutocomplete-listbox': {
                                            padding: '8px',
                                            maxHeight: '300px',
                                        },
                                        '& .MuiAutocomplete-option': {
                                            padding: '12px 16px',
                                            borderRadius: '8px',
                                            marginBottom: '4px',
                                            border: '1px solid transparent',
                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:last-child': {
                                                marginBottom: 0,
                                            },
                                            '&:hover': {
                                                backgroundColor: 'rgba(211, 186, 48, 0.08)',
                                                border: '1px solid rgba(211, 186, 48, 0.2)',
                                                transform: 'translateX(4px)',
                                            },
                                            '&[aria-selected="true"]': {
                                                backgroundColor: 'rgba(211, 186, 48, 0.15)',
                                                border: '1px solid rgba(211, 186, 48, 0.3)',
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: 'rgba(211, 186, 48, 0.08)',
                                                border: '1px solid rgba(211, 186, 48, 0.2)',
                                            },
                                        },
                                    },
                                },
                            }}
                            sx={{
                                '& .MuiAutocomplete-noOptions': {
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    padding: '16px',
                                    textAlign: 'center',
                                },
                            }}
                        />
                    )}

                    {/* Matched User Confirmation */}
                    {!selectedUser && matchedUser && (
                        <div className="p-3 bg-[#d3ba30]/10 border border-[#d3ba30]/30 rounded-lg mt-0">
                            <p className="text-[#d3ba30] text-xs font-semibold mb-0 uppercase tracking-wide">Usuario Seleccionado</p>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-[#d3ba30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="flex-1">
                                    <p className="text-white text-sm font-medium">{matchedUser.fullName}</p>
                                    <p className="text-white/60 text-xs">{matchedUser.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Card Preview */}
                    <div className="mt-0">
                        <p className="text-white/60 text-sm mb-1">Vista previa de la tarjeta:</p>
                        <CiensPayCard
                            holderName={selectedUser?.full_name || matchedUser?.fullName || "Nombre del Usuario"}
                            cardNumber={generatedCard ? generatedCard.match(/.{1,4}/g)?.join(' ') || generatedCard : previewCardNumber}
                            isStatic={true}
                        />
                    </div>


                </div>
            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Button
                    onClick={onClose}
                    sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'none' }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleAssign}
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={16} sx={{ color: '#000' }} /> : <CreditCard className="w-4 h-4" />}
                    disabled={loading || !!generatedCard}
                    sx={{
                        backgroundColor: '#d3ba30',
                        color: '#000000',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#b39928' },
                        '&.Mui-disabled': {
                            backgroundColor: 'rgba(211, 186, 48, 0.3)',
                            color: 'rgba(0, 0, 0, 0.5)',
                        },
                    }}
                >
                    {loading ? 'Generando...' : generatedCard ? 'Tarjeta Generada' : 'Asignar Tarjeta'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
