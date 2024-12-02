import { useEffect, useState } from "react";
import Kartya from "./kartya";
import { Telephone } from "../telephone";
import CostumeNavbar from "./navbar";
 
export default function Kezdolap() {
    const [Telephones, setTelephones] = useState<Telephone[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
 
    useEffect(() => {
        fetch('http://localhost:3000/telephones')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setTelephones(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);
 
    if (loading) {
        return <p>Loading...</p>;
    }
 
    if (error) {
        return <p>Error: {error}</p>;
    }
 
    const sortedTelephones = [...Telephones].sort((a, b) => a.ar - b.ar);
    const cheapestTelephones = sortedTelephones.slice(0, 3);
    const mostExpensiveTelephones = sortedTelephones.slice(-3).reverse();
 
    return (
        <>
            <CostumeNavbar />
            <div >
                <h2>Kezdőlap</h2>
                <h3>Legolcsóbb Telephoneek</h3>
                <ul>
                    {cheapestTelephones.map((Telephone) => (
                        Kartya(Telephone)
                    ))}
                </ul>
                <h2>Legdrágább Telephoneek</h2>
                <ul>
                    {mostExpensiveTelephones.map((Telephone) => (
                        Kartya(Telephone)
                    ))}
                </ul>
            </div>
        </>
    );
}