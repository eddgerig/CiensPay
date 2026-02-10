import { useState } from 'react';
import { Card, CardContent, IconButton } from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    ContentCopy,
    CheckCircle,
    Contactless
} from '@mui/icons-material';

interface CiensPayCardProps {
    holderName?: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    isStatic?: boolean;
}

export function CiensPayCard(props: CiensPayCardProps & { userData?: any }) {
    const [showCardDetails, setShowCardDetails] = useState(false);
    const [copiedCard, setCopiedCard] = useState(false);
    const { userData, isStatic = false, holderName, cardNumber, expiryDate, cvv } = props;

    // Prefer props, fallback to userData
    const cardNum = cardNumber || userData?.cards?.[0]?.['numero_tarjeta'];
    const cardHolder = holderName || userData?.user?.['full_name'];
    const cardExpiry = expiryDate || userData?.cards?.[0]?.['fecha_vencimiento'];
    const cardCvv = cvv || '•••'; // CVV might not be available in userData usually

    // Función para formatear fecha
    const formatDate = (dateString: string) => {
        if (!dateString) return '••/••';
        try {
            const date = new Date(dateString);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${month}/${day}`;
        } catch (error) {
            return '••/••';
        }
    };

    const handleCopyCard = () => {
        const cardNumber = cardNum || '';
        navigator.clipboard.writeText(cardNumber.replace(/\s/g, ''));
        setCopiedCard(true);
        setTimeout(() => setCopiedCard(false), 2000);
    };

    return (
        <Card
            sx={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
                border: '1px solid rgba(211, 186, 48, 0.2)',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                maxWidth: '580px',
                width: '100%',
                margin: '0 auto',
            }}
        >
            <CardContent sx={{ padding: '24px 32px' }}>
                {/* Circuit pattern background */}
                <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                                <circle cx="10" cy="10" r="2" fill="#d3ba30" opacity="0.3" />
                                <circle cx="50" cy="50" r="2" fill="#d3ba30" opacity="0.3" />
                                <circle cx="90" cy="30" r="2" fill="#d3ba30" opacity="0.3" />
                                <line x1="10" y1="10" x2="50" y2="50" stroke="#d3ba30" strokeWidth="0.5" opacity="0.2" />
                                <line x1="50" y1="50" x2="90" y2="30" stroke="#d3ba30" strokeWidth="0.5" opacity="0.2" />
                                <rect x="40" y="5" width="8" height="8" fill="none" stroke="#d3ba30" strokeWidth="0.5" opacity="0.2" />
                                <rect x="70" y="60" width="6" height="6" fill="none" stroke="#d3ba30" strokeWidth="0.5" opacity="0.2" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#circuit)" />
                    </svg>
                </div>

                {/* Header Section */}
                <div className="relative flex items-start justify-between mb-6">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <img
                            src="/log_dorado.png"
                            alt="CiensPay Logo"
                            className="w-10 h-10 object-contain"
                        />
                        <span className="text-white text-xl tracking-wide">CiensPay</span>
                    </div>

                    {/* Brand name and controls */}
                    <div className="flex items-center gap-4">

                        {/* Contactless icon */}
                        <div className="flex items-center">
                            <Contactless sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 28 }} />
                        </div>

                        {/* Eye button */}
                        {!isStatic && (
                            <button
                                onClick={() => setShowCardDetails(!showCardDetails)}
                                className="p-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-[#d3ba30] rounded-lg transition-colors"
                            >
                                {showCardDetails ? (
                                    <VisibilityOff sx={{ fontSize: 20 }} />
                                ) : (
                                    <Visibility sx={{ fontSize: 20 }} />
                                )}
                            </button>
                        )}
                    </div>
                </div>

                <div className="relative mb-5">
                    <svg width="50" height="40" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-10">
                        <rect width="50" height="40" rx="6" fill="url(#chip-gradient)" />
                        <path d="M0 13H15M35 13H50M0 27H15M35 27H50M25 0V40M15 13C15 13 18 13 18 20C18 27 15 27 15 27M35 13C35 13 32 13 32 20C32 27 35 27 35 27" stroke="#1a1a1a" strokeWidth="1" strokeOpacity="0.3" />
                        <defs>
                            <linearGradient id="chip-gradient" x1="0" y1="0" x2="50" y2="40" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#E2E8F0" />
                                <stop offset="0.5" stopColor="#CBD5E1" />
                                <stop offset="1" stopColor="#94A3B8" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Card Number */}
                <div className="relative mb-5">
                    {showCardDetails || isStatic ? (
                        <div className="flex items-center gap-3">
                            <p className="text-gray-400 text-lg tracking-[0.3em] font-mono">{cardNum || '•••• •••• •••• ••••'}</p>
                            {!isStatic && (
                                <IconButton
                                    size="small"
                                    onClick={handleCopyCard}
                                    sx={{ color: copiedCard ? '#4ade80' : 'rgba(255,255,255,0.4)', padding: '4px' }}
                                >
                                    {copiedCard ? <CheckCircle sx={{ fontSize: 16 }} /> : <ContentCopy sx={{ fontSize: 16 }} />}
                                </IconButton>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-lg tracking-[0.3em] font-mono">•••• •••• •••• {cardNum?.slice(-4) || '••••'}</p>
                    )}
                </div>

                {/* Bottom section */}
                <div className="relative flex items-end justify-between">
                    <div className="flex gap-8">
                        {/* Valid thru */}
                        <div>
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Valid Thru</p>
                            <p className="text-gray-400 text-sm tracking-wider">{showCardDetails || isStatic ? formatDate(cardExpiry) : '••/••'}</p>
                        </div>

                        {/* Cardholder name */}
                        <div>
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Cardholder</p>
                            <p className="text-gray-400 text-sm tracking-wider uppercase">{cardHolder}</p>
                        </div>

                        {/* CVV */}
                        {(showCardDetails || isStatic) && (
                            <div>
                                <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">CVV</p>
                                <p className="text-gray-400 text-sm tracking-wider">{cardCvv}</p>
                            </div>
                        )}
                    </div>

                    {/* Mastercard logo */}
                    <div className="flex items-center gap-0">
                        <div className="w-10 h-10 rounded-full bg-[#eb001b] opacity-90"></div>
                        <div className="w-10 h-10 rounded-full bg-[#f79e1b] opacity-90 -ml-4"></div>
                    </div>
                </div>

                {/* Subtle glow effects */}
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#d3ba30]/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-[#d3ba30]/5 rounded-full blur-3xl pointer-events-none"></div>
            </CardContent>
        </Card>
    );
}
