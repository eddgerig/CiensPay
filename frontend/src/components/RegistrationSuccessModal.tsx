import { CheckCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';

interface RegistrationSuccessModalProps {
    open: boolean;
    onClose: () => void;
}

export function RegistrationSuccessModal({ open, onClose }: RegistrationSuccessModalProps) {
    return (
        <Dialog open={open} onOpenChange={(isOpen: boolean) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-md bg-black/90 border border-primary/20 backdrop-blur-xl text-white">
                <DialogHeader>
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold text-primary">
                        ¡Cuenta Creada Exitosamente!
                    </DialogTitle>
                    <DialogDescription className="text-center text-white/70 text-base pt-2">
                        Tu registro se ha completado correctamente. Ahora puedes iniciar sesión para acceder a todos nuestros servicios.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 sm:justify-center">
                    <Button
                        onClick={onClose}
                        className="w-full sm:w-auto min-w-[200px] bg-primary text-black hover:bg-primary/90 font-bold"
                    >
                        Ir a Iniciar Sesión
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
