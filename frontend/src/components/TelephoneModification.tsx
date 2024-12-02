import { useEffect, useState } from "react";
import { Form, Button, Container, Table, Modal } from 'react-bootstrap';
import { Telephone } from "../telephone";
import CostumeNavbar from "./navbar";

export default function TelephoneModification() {
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

  const handleEdit = (Telephone: Telephone) => {
    setEditData(Telephone);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    if (!editData) return;
    try {
      const response = await fetch(`http://localhost:3000/Telephones/${editData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      setShowModal(false);
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

  const sortTelephones = (key: keyof Telephone, direction: "asc" | "desc") => {
    const sortedPhones = [...items].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setItems(sortedPhones);
    setSortConfig({ key, direction });
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
        <h1>Telephonok módosítás</h1>
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
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
            <th>
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
            </th>
              <th>
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
            </th>
              <th>
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
            </th>
              <th>
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
            </th>
              <th>
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
            </th>
              <th>
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
            </th>
              <th>
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
            </th>
              <th>Leírás</th>
              <th>
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
            </th>
              <th>Műveletek</th>
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
                <td>
                  <Button variant="warning" onClick={() => handleEdit(Telephone)}>Módosítás</Button>
                </td>
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
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Telephone Módosítása</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Mégse
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Mentés
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}