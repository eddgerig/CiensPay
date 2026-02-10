import { useState, useEffect } from 'react';
import { CiensPayCard } from '../components/CiensPayCard';
import { BalanceCard } from '../components/BalanceCard';
import { TransactionHistory } from '../components/TransactionHistory';
import { DashboardHeader } from '../components/DashboardHeader';

interface DashboardProps {
    onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
    const [storedValue, setStoredValue] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);

    // Leer del localStorage cuando el componente se monte
    useEffect(() => {
        const value = localStorage.getItem('user');
        setStoredValue(value);
    }, []);

    // Función para actualizar el valor
    const updateValue = (newValue: string) => {
        localStorage.setItem('user', newValue);
        setStoredValue(newValue);
    };

    // Llamar a la API cuando hay un valor en el localStorage
    useEffect(() => {
        const fetchData = async () => {
            if (storedValue) {
                try {
                    console.log('Obteniendo datos para el usuario:', JSON.parse(storedValue) );
                    const userId = JSON.parse(storedValue).id; // Asegúrate de que el formato del valor almacenado es correcto
                    const response = await fetch(`http://localhost:8000/api/user/${userId}/financial-data/`);
                    
                    if (!response.ok) {
                        throw new Error('Error al obtener los datos del usuario');
                    }
                    
                    const data = await response.json();
                    setUserData(data);
                    console.log('Datos del usuario:', data);
                    
                    // Aquí puedes manejar los datos recibidos, por ejemplo:
                    // setUserData(data);
                    
                } catch (error) {
                    console.error('Error al llamar a la API:', error);
                }
            }
        };

        fetchData();
    }, [storedValue]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black">
            {/* Header */}
            {/* Header */}
            
            <DashboardHeader onLogout={onLogout} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section <div className="mb-8">
                    <h1 className="text-3xl text-white mb-2">¡Bienvenido de vuelta!</h1>
                    <p className="text-white/60">Aquí está un resumen de tu actividad financiera</p>
                </div>*/}


                {/* Top Panel - Balance and Card */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Panel - Cards */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6 min-w-[350px]">
                        <BalanceCard userData={userData?.cards?.[0]} />
                        <CiensPayCard userData={userData} />
                    </div>

                    {/* Right Panel - Transactions */}
                    <div className="flex-1">
                        <TransactionHistory userData={userData?.transactions} />
                    </div>
                </div>
            </div>
        </div>
    );
}