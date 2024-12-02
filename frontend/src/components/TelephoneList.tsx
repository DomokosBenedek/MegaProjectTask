import { useEffect, useState } from "react";
import { Telephone } from "../telephone";
import Kartya from "./kartya";
import CostumeNavbar from "./navbar";

export default function TelephoneList() {
  const [Telephones, setTelephones] = useState<Telephone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorServer, setErrorServer] = useState("");
  const [page, setPage] = useState(1);
  const [maxitems, setMaxitems] = useState(2);
  const [items, setItems] = useState<Telephone[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Telephone;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/Telephones");
        if (response.status === 404) {
          setErrorServer("Resource not found (404)");
        }
        if (!response.ok) {
          setErrorServer(`Server responded with status ${response.status}`);
        }
        const data = await response.json();
        setTelephones(data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message || "Unknown error");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  function Showdata() {
    setItems([]);
    const startIndex = (page - 1) * maxitems;
    const endIndex = Math.min(page * maxitems, Telephones.length);
    const newItems = Telephones.slice(startIndex, endIndex);
    setItems(newItems);
  }

  useEffect(() => {
    Showdata();
  }, [page, Telephones, maxitems]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = Telephones.filter(
      (Telephone) =>
        Telephone.Nev.toLowerCase().includes(term) ||
        Telephone.RAM.toString().includes(term) ||
        Telephone.ar.toString().includes(term) ||
        Telephone.kijelzoFelbontas.toLocaleLowerCase().includes(term) ||
        Telephone.kijelzoMeret.toString().includes(term) ||
        Telephone.opRendszer.toLocaleLowerCase().includes(term) ||
        Telephone.procMagok.toString().includes(term) ||
        Telephone.procOrajel.toString().includes(term)
    );
    setItems(filtered);
  };

  const sortTelephones = (key: keyof Telephone, direction: "asc" | "desc") => {
    const sortedPhones = [...items].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setItems(sortedPhones);
    setSortConfig({ key, direction });
  };

  if (errorServer) {
    return <p>ErrorServer: {errorServer}</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <CostumeNavbar />
      <div>
        <h2>Telephoneek</h2>
        <form>
          <label>
            Keresés:
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Márka, típus vagy ár alapján..."
            />
          </label>
        </form>
        <div>
          <label htmlFor="megjelen" className="me-1">
            Egy oldalon megjelenő Telephoneek száma:
          </label>
          <input
            type="number"
            name="megjelen"
            id="megjelen"
            value={maxitems}
            onChange={(e) => {
              setMaxitems(parseInt(e.currentTarget.value));
            }}
          />
        </div>
        <br />
        <div className="container">
          <div className="row">
            <div className="col">
              Név
              <button
                onClick={() => sortTelephones("Nev", "asc")}
                style={{
                  textDecoration: "none",
                  border: "none",
                  background: "none",
                }}
              >
                &#8593;
              </button>
              <button
                onClick={() => sortTelephones("Nev", "desc")}
                style={{
                  textDecoration: "none",
                  border: "none",
                  background: "none",
                }}
              >
                &#8595;
              </button>
            </div>
            <div className="col">
              Operációs rendszer
              <button
                onClick={() => sortTelephones("opRendszer", "asc")}
                style={{
                  textDecoration: "none",
                  border: "none",
                  background: "none",
                }}
              >
                &#8593;
              </button>
              <button
                onClick={() => sortTelephones("opRendszer", "desc")}
                style={{
                  textDecoration: "none",
                  border: "none",
                  background: "none",
                }}
              >
                &#8595;
              </button>
            </div>
            <div className="col">
                Processzor órajele
              <button
                onClick={() => sortTelephones("procOrajel", "asc")}
                style={{
                  textDecoration: "none",
                  border: "none",
                  background: "none",
                }}
              >
                &#8593;
              </button>
              <button
                onClick={() => sortTelephones("procOrajel", "desc")}
                style={{
                  textDecoration: "none",
                  border: "none",
                  background: "none",
                }}
              >
                &#8595;
              </button>
            </div>
            <div className="col">
            Processzor magok száma
              <button
                onClick={() => sortTelephones("procMagok", "asc")}
                style={{
                  textDecoration: "none",
                  border: "none",
                  background: "none",
                }}
              >
                &#8593;
              </button>
              <button
                onClick={() => sortTelephones("procMagok", "desc")}
                style={{
                  textDecoration: "none",
                  border: "none",
                  background: "none",
                }}
              >
                &#8595;
              </button>
            </div>
            <div className="col">
            Kijelző Méret
              <button
                onClick={() => sortTelephones("kijelzoMeret", "asc")}
                style={{
                  textDecoration: "none",
                  border: "none",
                  background: "none",
                }}
              >
                &#8593;
              </button>
              <button
                onClick={() => sortTelephones("kijelzoMeret", "desc")}
                style={{
                  textDecoration: "none",
                  border: "none",
                  background: "none",
                }}
              >
                &#8595;
              </button>
            </div>
            <div className="col">
            Kijelző Felbontás
              <button
                onClick={() => sortTelephones("kijelzoFelbontas", "asc")}
                style={{
                  textDecoration: "none",
                  border: "none",
                  background: "none",
                }}
              >
                &#8593;
              </button>
              <button
                onClick={() => sortTelephones("kijelzoFelbontas", "desc")}
                style={{
                  textDecoration: "none",
                  border: "none",
                  background: "none",
                }}
              >
                &#8595;
              </button>
            </div>
            <div className="col">
            RAM
              <button
                onClick={() => sortTelephones("RAM", "asc")}
                style={{
                  textDecoration: "none",
                  border: "none",
                  background: "none",
                }}
              >
                &#8593;
              </button>
              <button
                onClick={() => sortTelephones("RAM", "desc")}
                style={{
                  textDecoration: "none",
                  border: "none",
                  background: "none",
                }}
              >
                &#8595;
              </button>
            </div>
            <div className="col">
            ÁR
              <button
                onClick={() => sortTelephones("ar", "asc")}
                style={{
                  textDecoration: "none",
                  border: "none",
                  background: "none",
                }}
              >
                &#8593;
              </button>
              <button
                onClick={() => sortTelephones("ar", "desc")}
                style={{
                  textDecoration: "none",
                  border: "none",
                  background: "none",
                }}
              >
                &#8595;
              </button>
            </div>
          </div>
          {items.map((Telephone) => Kartya(Telephone))}
        </div>
      </div>
      <div className="pagination mt-3">
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
          Előző
        </button>
        <span>Oldal: {page}</span>
        <button
          onClick={() =>
            setPage((prev) =>
              Math.min(prev + 1, Math.ceil(Telephones.length / maxitems))
            )
          }
        >
          Következő
        </button>
      </div>
    </>
  );
}