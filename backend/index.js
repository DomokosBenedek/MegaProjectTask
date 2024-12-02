import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "telephones",
  })
  .promise();

app.get("/telephones", async (req, res) => {
  try {
    const temp = await db.query("SELECT * FROM telephones");
    const rows = temp[0];
    res.status(200).json(rows);
  } catch (error) {
    console.error(`Error retrieving posts: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/telephones", async (req, res) => {
  try {
    let postData = req.body;
    const [rows] = await db.query(
      "INSERT INTO `telephones` (`Nev`, `opRendszer`, `procOrajel`, `procMagok`, `kijelzoMeret`, `kijelzoFelbontas`, `RAM`, `leiras`, `ar`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
      [postData.Nev,postData.opRendszer,postData.procOrajel,postData.procMagok,postData.kijelzoMeret,postData.kijelzoFelbontas,postData.RAM,postData.leiras,postData.ar]
    );
    res.status(200).json({ message: "telephone was successfully added!" });
  } catch (error) {
    console.error(`Error adding telephone: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/telephones/:telephoneId", async (req, res) => {
  try {
    let telephoneId = parseInt(req.params.telephoneId);
    const [rows] = await db.query("DELETE FROM telephones WHERE id = ?", [telephoneId]);
    if (rows.affectedRows === 0) {
      res.status(404).json({ error: "telephone not found" });
    } else {
      res.status(200).json({ message: "telephone was successfully removed" });
    }
  } catch (error) {
    console.error(`Error deleting telephone: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/telephones/:id', async (req, res) => {
  try {
    let telephoneId = parseInt(req.params.id);
    const [rows] = await db.query('SELECT id, title, content, create_at FROM telephones WHERE id = ?', [telephoneId]);
    if (rows.length === 1) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: 'telephone not found' });
    }
  } catch (error) {
    console.error(`Error retrieving telephone: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/telephones/:id", async (req, res) => {
  try {
    const telephoneId = parseInt(req.params.id);
    const { Nev, opRendszer, procOrajel, procMagok, kijelzoMeret, kijelzoFelbontas, RAM, leiras, ar } = req.body;
    const [result] = await db.query(
      "UPDATE telephones SET Nev = ?, opRendszer = ?, procOrajel = ?, procMagok = ?, kijelzoMeret = ?, kijelzoFelbontas = ?, RAM = ?, leiras = ?, ar = ? WHERE id = ?",
      [Nev, opRendszer, procOrajel, procMagok, kijelzoMeret, kijelzoFelbontas, RAM, leiras, ar, telephoneId]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "telephone not found" });
    } else {
      res.status(200).json({ message: "telephone was successfully updated" });
    }
  } catch (error) {
    console.error(`Error updating telephone: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
