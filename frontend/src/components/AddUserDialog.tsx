import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    IconButton
} from '@mui/material';
import { X } from 'lucide-react';
import { RegisterForm, type RegisterFormData } from './RegisterForm';

interface AddUserDialogProps {
    open: boolean;
    onClose: () => void;
    onRegister: (userData: RegisterFormData) => void;
    initialData?: Partial<RegisterFormData> | null;
}

export function AddUserDialog({ open, onClose, onRegister, initialData }: AddUserDialogProps) {
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
                    minWidth: '650px',
                    maxWidth: '1000px',
                },
            }}
        >
            <DialogTitle sx={{
                color: 'white',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {initialData ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
                <IconButton onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    <X className="w-5 h-5" />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ marginTop: '5px' }}>
                <RegisterForm
                    embedded
                    hidePassword
                    initialData={initialData || undefined}
                    submitLabel={initialData ? 'Aceptar' : 'Crear Cuenta'}
                    onSubmit={(data) => {
                        onRegister(data);
                        onClose();
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
