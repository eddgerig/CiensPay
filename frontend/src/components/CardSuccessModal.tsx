import { Dialog, DialogContent, Button, Box } from '@mui/material';
import { CheckCircle, X } from 'lucide-react';
import { CiensPayCard } from './CiensPayCard';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface CardSuccessModalProps {
    open: boolean;
    onClose: () => void;
    cardNumber: string;
    holderName: string;
}

export function CardSuccessModal({ open, onClose, cardNumber, holderName }: CardSuccessModalProps) {
    useEffect(() => {
        if (open) {
            // Golden confetti animation
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = {
                startVelocity: 30,
                spread: 360,
                ticks: 60,
                zIndex: 2000,
                colors: ['#d3ba30', '#FFD700', '#FFC125', '#DAA520']
            };

            const randomInRange = (min: number, max: number) => {
                return Math.random() * (max - min) + min;
            };

            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                // Launch from left
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                });

                // Launch from right
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#1a1a1a',
                    backgroundImage: 'none',
                    border: '2px solid #d3ba30',
                    borderRadius: '20px',
                    padding: '20px',
                    position: 'relative',
                    overflow: 'visible',
                },
            }}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    zIndex: 10,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(211, 186, 48, 0.3)';
                    e.currentTarget.style.transform = 'rotate(90deg)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'rotate(0deg)';
                }}
            >
                <X style={{ width: '18px', height: '18px', color: '#d3ba30' }} />
            </button>

            <DialogContent sx={{ padding: '20px 10px', textAlign: 'center' }}>
                {/* Success Icon with Animation */}
                <Box
                    sx={{
                        display: 'inline-block',
                        animation: 'bounce 0.6s ease-in-out',
                        '@keyframes bounce': {
                            '0%, 100%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.2)' },
                        },
                    }}
                >
                    <div
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #d3ba30 0%, #FFD700 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            boxShadow: '0 0 30px rgba(211, 186, 48, 0.5)',
                        }}
                    >
                        <CheckCircle style={{ width: '48px', height: '48px', color: '#000' }} />
                    </div>
                </Box>

                {/* Title */}
                <h2
                    style={{
                        color: '#d3ba30',
                        fontSize: '28px',
                        fontWeight: 'bold',
                        margin: '0 0 10px',
                        textShadow: '0 0 20px rgba(211, 186, 48, 0.3)',
                    }}
                >
                    ¡Tarjeta Creada!
                </h2>

                <p
                    style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                        marginBottom: '30px',
                    }}
                >
                    La tarjeta virtual ha sido generada exitosamente
                </p>

                {/* Animated Card Display */}
                <Box
                    sx={{
                        animation: 'slideUp 0.8s ease-out',
                        '@keyframes slideUp': {
                            '0%': { transform: 'translateY(50px)', opacity: 0 },
                            '100%': { transform: 'translateY(0)', opacity: 1 },
                        },
                    }}
                >
                    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                        <CiensPayCard
                            holderName={holderName}
                            cardNumber={cardNumber.match(/.{1,4}/g)?.join(' ') || cardNumber}
                            isStatic={true}
                        />
                    </div>
                </Box>



                {/* Close Button */}
                <Button
                    onClick={onClose}
                    variant="contained"
                    fullWidth
                    sx={{
                        marginTop: '25px',
                        backgroundColor: '#d3ba30',
                        color: '#000',
                        textTransform: 'none',
                        fontSize: '16px',
                        padding: '12px',
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: '#b39928',
                        },
                    }}
                >
                    Continuar
                </Button>
            </DialogContent>
        </Dialog>
    );
}
