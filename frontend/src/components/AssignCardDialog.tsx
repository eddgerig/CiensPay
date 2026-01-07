import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    InputAdornment
} from '@mui/material';
import { CreditCard, DollarSign } from 'lucide-react';

interface User {
    id: number;
    documentType: string;
    documentNumber: string;
    fullName: string;
    // other fields omitted as they are not used for display here
}

interface AssignCardDialogProps {
    open: boolean;
    onClose: () => void;
    onAssign: (cardData: { documentNumber: string; limit: number }) => void;
    selectedUser: User | null;
}

export function AssignCardDialog({ open, onClose, onAssign, selectedUser }: AssignCardDialogProps) {
    const [cardData, setCardData] = useState({
        documentNumber: '',
        limit: 50000,
    });

    // Reset or sync state when modal opens or user changes
    useEffect(() => {
        if (open) {
            if (selectedUser) {
                setCardData({
                    documentNumber: selectedUser.documentNumber,
                    limit: 50000
                });
            } else {
                setCardData({
                    documentNumber: '',
                    limit: 50000
                });
            }
        }
    }, [open, selectedUser]);

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

    const handleAssign = () => {
        // Use selectedUser's document number if available, otherwise use input
        const finalDocumentNumber = selectedUser ? selectedUser.documentNumber : cardData.documentNumber;
        onAssign({
            documentNumber: finalDocumentNumber,
            limit: cardData.limit
        });
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
            <DialogContent sx={{ paddingTop: '20px' }}>
                <div className="flex flex-col gap-6">
                    {selectedUser && (
                        <div className="p-4 bg-white/5 border border-primary/20 rounded-lg">
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
                            value={cardData.documentNumber}
                            onChange={(e) => setCardData({ ...cardData, documentNumber: e.target.value })}
                            sx={inputStyles}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CreditCard style={{ color: '#d3ba30', width: '16px', height: '16px' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}

                    <TextField
                        fullWidth
                        label="Límite de Tarjeta"
                        type="number"
                        placeholder="Ingrese el límite de crédito"
                        value={cardData.limit}
                        onChange={(e) => setCardData({ ...cardData, limit: parseInt(e.target.value) || 0 })}
                        sx={inputStyles}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <DollarSign style={{ color: '#d3ba30', width: '16px', height: '16px' }} />
                                </InputAdornment>
                            ),
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
                    onClick={onClose}
                    sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'none' }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleAssign}
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
    );
}
