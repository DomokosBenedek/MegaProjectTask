import { Telephone } from "../telephone";
import TelephoneLista from "./TelephoneList";

export default function Kartya(TelephoneLista: Telephone) {
  return (
    <>
      <div className="row row-cols-9 border border-dark">
        <div className="col"><strong>Név: </strong>{TelephoneLista.Nev}</div>
        <div className="col"><strong>Operációs rendszer:</strong> {TelephoneLista.opRendszer}</div>
        <div className="col"><strong>Processzor órajele:</strong> {TelephoneLista.procOrajel}</div>
        <div className="col"><strong>Processzor magok száma:</strong> {TelephoneLista.procMagok}</div>
        <div className="col"><strong>Kijelző Méret:</strong> {TelephoneLista.kijelzoMeret}</div>
        <div className="col"><strong>Kijelző Felbontás:</strong> {TelephoneLista.kijelzoFelbontas}</div>
        <div className="col"><strong>RAM:</strong> {TelephoneLista.RAM}</div>
        <div className="col-5"><strong>Leírás:</strong> {TelephoneLista.leiras}</div>
        <div className="col"><strong>ÁR:</strong> {TelephoneLista.ar}</div>
      </div>
    </>
  );
}
