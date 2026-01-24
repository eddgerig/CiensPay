import { useState } from 'react';
import { RegisterForm } from '../components/RegisterForm';
import { RegistrationSuccessModal } from '../components/RegistrationSuccessModal';

interface RegisterProps {
    onBack: () => void;
    onRegisterSuccess: () => void;
}

export function Register({ onBack, onRegisterSuccess }: RegisterProps) {
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleRegisterSuccess = () => {
        setShowSuccessModal(true);
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        onRegisterSuccess();
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
                {/* Back button                 <button
                    onClick={onBack}
                    className="absolute -top-16 left-4 flex items-center gap-2 text-white/60 hover:text-primary transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Volver</span>
                </button>*/}


                {/* Register Card */}
                <RegisterForm onBack={onBack} onRegisterSuccess={handleRegisterSuccess} />
            </div>

            <RegistrationSuccessModal
                open={showSuccessModal}
                onClose={handleCloseModal}
            />
        </div>
    );
}
