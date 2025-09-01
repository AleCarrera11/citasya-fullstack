'use client';

import * as React from "react";
import { ServiceFormField } from "../../components/InputField";
import { VscEdit } from "react-icons/vsc";

type CenterData = {
    name: string;
    phone: string;
    description: string;
    address: string;
    socialMedia: string;
    hours: string;
};

function CenterDataForm() {

    const [centerData, setCenterData] = React.useState<CenterData | null>(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true); 
    const [error, setError] = React.useState<string | null>(null); 

    // useEffect para cargar los datos del centro cuando el componente se monta.
    React.useEffect(() => {
        const fetchCenterData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/centers/1`);
                if (!response.ok) {
                    throw new Error("No se pudo cargar la data del centro.");
                }
                const data = await response.json();
                
                const formattedData = {
                    ...data,
                    socialMedia: `Instagram: ${data.social_media?.instagram || ''}, TikTok: ${data.social_media?.tiktok || ''}`,
                    hours: `Lunes a Viernes: ${data.bussinesTime?.monday_to_friday || ''}, Sábados y Domingos: ${data.bussinesTime?.saturday_and_sunday || ''}`,
                };
                
                setCenterData(formattedData);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Ocurrió un error inesperado');
                }
                console.error("Error al cargar la data del centro:", err);
            } finally {
                setIsLoading(false); // Desactiva el estado de carga
            }
        };

        fetchCenterData();
    }, []); 

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name?: string; value: string | string[]; }; }
    ) => {
        const { name, value } = e.target;
        if (!name || !centerData) return;
        setCenterData(prevData => {
            if (!prevData) return null;
            return {
                ...prevData,
                [name]: Array.isArray(value) ? value.join(', ') : value,
            };
        });
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true); 
        if (!centerData) return;

        const updatedData = {
            name: centerData.name,
            phone: centerData.phone,
            description: centerData.description,
            address: centerData.address,
            social_media: {
                instagram: centerData.socialMedia.split('Instagram: ')[1]?.split(',')[0]?.trim(),
                tiktok: centerData.socialMedia.split('TikTok: ')[1]?.trim(),
            },
            bussinesTime: {
                monday_to_friday: centerData.hours.split('Lunes a Viernes: ')[1]?.split(',')[0]?.trim(),
                saturday_and_sunday: centerData.hours.split('Sábados y Domingos: ')[1]?.trim(),
            },
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/centers/1`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error("Error al guardar los cambios.");
            }
            
            console.log("Datos actualizados:", await response.json());
            setIsEditing(false); 
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocurrió un error inesperado');
            }
            console.error("Error al guardar los cambios:", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <section className="mx-auto mt-9 w-full max-w-8xl rounded-3xl bg-green-200/40 p-14 max-md:px-5 max-md:mt-7 text-center">
                <p className="text-xl font-medium text-neutral-600">Cargando datos del centro...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="mx-auto mt-9 w-full max-w-8xl rounded-3xl bg-red-200/40 p-14 max-md:px-5 max-md:mt-7 text-center">
                <p className="text-xl font-medium text-red-700">Error: {error}</p>
            </section>
        );
    }
    
    return (
        <section className="mx-auto mt-9 w-full max-w-8xl rounded-3xl bg-green-200/40 p-14 max-md:px-5 max-md:mt-7">
            <div className="flex items-center justify-between max-md:flex-col max-md:items-start">
                <h2 className="text-3xl font-semibold tracking-wide leading-none text-neutral-600 flex items-center gap-2 max-md:mb-6" style={{ fontFamily: "Roboto Condensed, sans-serif" }}>
                    Datos del centro
                    <VscEdit
                        size={24}
                        className={`${isEditing ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''} ml-20 cursor-pointer text-yellow-700/60 hover:text-yellow-700 transition-colors`}
                        onClick={() => setIsEditing(!isEditing)}
                    />
                </h2>
            </div>

            <form onSubmit={handleSave}>
                <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 w-full ">
                    <ServiceFormField
                        label="Nombre del centro:"
                        name="name"
                        value={centerData?.name || ''}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        whiteBg={true}
                    />
                    <ServiceFormField
                        label="Teléfono:"
                        name="phone"
                        value={centerData?.phone || ''}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        whiteBg={true}
                    />
                </div>

                <div className="mt-10">
                    <ServiceFormField
                        label="Descripción:"
                        name="description"
                        value={centerData?.description || ''}
                        onChange={handleChange}
                        type='textarea'
                        readOnly={!isEditing}
                        whiteBg={true}
                    />
                </div>

                <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
                    <div className="flex flex-col gap-6">
                        <ServiceFormField
                            label="Dirección:"
                            name="address"
                            value={centerData?.address || ''}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            whiteBg={true}
                        />
                        <ServiceFormField
                            label="Redes Sociales:"
                            name="socialMedia"
                            value={centerData?.socialMedia || ''}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            whiteBg={true}
                        />
                    </div>
                    <ServiceFormField
                        label="Horario de Atención:"
                        name="hours"
                        value={centerData?.hours || ''}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        whiteBg={true}
                    />
                </div>

                {isEditing && (
                    <div className="flex justify-end mt-10">
                        <button
                            type="submit"
                            className="py-2 px-6 rounded-lg bg-yellow-700/60 text-white font-semibold hover:bg-yellow-700 transition-colors"
                        >
                            Guardar
                        </button>
                    </div>
                )}
            </form>
        </section>
    );
}

// Componente principal de la página
function Profile() {
    return (
        <div className="relative w-full min-h-screen bg-neutral-100 flex flex-col items-center pb-72 max-md:pb-24">
            <main className="flex flex-col items-center w-full max-w-5xl px-5">
                <h1 className="mt-8 text-3xl font-medium text-[#447F98] max-md:mt-10 max-md:text-3xl" style={{ fontFamily: "Roboto Condensed, sans-serif" }}>
                    Perfil de Usuario
                </h1>
            </main>
        </div>
    );
}

export default Profile;
