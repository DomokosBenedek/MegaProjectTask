import { useEffect, useState } from "react";
import { Form, Container, Table} from 'react-bootstrap';
import { Telephone } from "../telephone";
import CostumeNavbar from "./navbar";

export default function telephoneSearch() {
  const [Telephones, setTelephones] = useState<Telephone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Telephone>({
    id: 0,
    Nev: '',
    opRendszer: '',
    procOrajel: 0,
    procMagok: 0,
    kijelzoMeret: 0,
    kijelzoFelbontas: '',
    RAM: 0,
    leiras: '',
    ar: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Telephone | null>(null);

  const [page, setPage] = useState(1);
  const [maxitems, setMaxitems] = useState(2);
  const [items, setItems] = useState<Telephone[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Telephone;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    fetchTelephones();
  }, []);

  const fetchTelephones = async () => {
    try {
      const response = await fetch('http://localhost:3000/Telephones');
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      const data = await response.json();
      setTelephones(data);
      setLoading(false);
    } catch (error:any) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/Telephones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        throw new Error(`Hiba történt: ${response.status}`);
      }
      setFormData({
        id: 0,
        Nev: '',
        opRendszer: '',
        procOrajel: 0,
        procMagok: 0,
        kijelzoMeret: 0,
        kijelzoFelbontas: '',
        RAM: 0,
        leiras: '',
        ar: 0,
      });
      fetchTelephones();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/Telephones/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      fetchTelephones();
    } catch (error:any) {
      setError(error.message);
    }
  };



  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editData) return;
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <CostumeNavbar />
      <Container>
        <h1>Telephonok Keresés</h1>
        <form>
          <label>
            Keresés:
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Keresés..."
            />
          </label>
        </form>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
            <th>
              Név
            </th>
              <th>
              Operációs rendszer
            </th>
              <th>
                Processzor órajele
            </th>
              <th>
            Processzor magok száma
            </th>
              <th>
            Kijelző Méret
            </th>
              <th>
            Kijelző Felbontás
            </th>
              <th>
            RAM
            </th>
              <th>Leírás</th>
              <th>
            ÁR
            </th>
            </tr>
          </thead>
          <tbody>
            {items.map((Telephone) => (
              <tr key={Telephone.id}>
                <td>{Telephone.Nev}</td>
                <td>{Telephone.opRendszer}</td>
                <td>{Telephone.procOrajel}</td>
                <td>{Telephone.procMagok}</td>
                <td>{Telephone.kijelzoMeret}</td>
                <td>{Telephone.kijelzoFelbontas}</td>
                <td>{Telephone.RAM}</td>
                <td>{Telephone.leiras}</td>
                <td>{Telephone.ar}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div style={{width:"fit-content", margin:"auto",marginBottom:"1rem"}}>
        <button style={{width:"fit-content"}} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
          Előző
        </button>
        <span style={{width:"fit-content"}}>Oldal: {page}</span>
        <button style={{width:"fit-content"}}
          onClick={() =>
            setPage((prev) =>
              Math.min(prev + 1, Math.ceil(Telephones.length / maxitems))
            )
          }
        >
          Következő
        </button>
      </div>
            {editData && (
              <Form>
                <Form.Group controlId="formEditNev">
                  <Form.Label>Név</Form.Label>
                  <Form.Control
                    type="text"
                    name="Nev"
                    value={editData.Nev}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEditOpRendszer">
                  <Form.Label>Operációs Rendszer</Form.Label>
                  <Form.Control
                    type="text"
                    name="opRendszer"
                    value={editData.opRendszer}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEditProcOrajel">
                  <Form.Label>Processzor Órajel</Form.Label>
                  <Form.Control
                    type="number"
                    name="procOrajel"
                    value={editData.procOrajel}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEditProcMagok">
                  <Form.Label>Processzor Magok</Form.Label>
                  <Form.Control
                    type="number"
                    name="procMagok"
                    value={editData.procMagok}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEditKijelzoMeret">
                  <Form.Label>Kijelző Méret</Form.Label>
                  <Form.Control
                    type="number"
                    name="kijelzoMeret"
                    value={editData.kijelzoMeret}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEditKijelzoFelbontas">
                  <Form.Label>Kijelző Felbontás</Form.Label>
                  <Form.Control
                    type="text"
                    name="kijelzoFelbontas"
                    value={editData.kijelzoFelbontas}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEditRAM">
                  <Form.Label>RAM</Form.Label>
                  <Form.Control
                    type="number"
                    name="RAM"
                    value={editData.RAM}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEditLeiras">
                  <Form.Label>Leírás</Form.Label>
                  <Form.Control
                    type="text"
                    name="leiras"
                    value={editData.leiras}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEditAr">
                  <Form.Label>Ár</Form.Label>
                  <Form.Control
                    type="number"
                    name="ar"
                    value={editData.ar}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
              </Form>
            )}
      </Container>
    </>
  );
}