import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";

admin.initializeApp();

admin.firestore().settings({
  ignoreUndefinedProperties: true
});

const app = express();
app.use(cors({ origin: "*" })); // Permitir solicitudes de "http://localhost:8100"

app.post("/createUser", async (req, res) => {
    try {
      const { email, password, nombre_completo, rol } = req.body;
  
      // Validación para asegurar que no haya valores undefined
      if (!email || !password || !nombre_completo || !rol) {
        return res.status(400).send({
          error: "Todos los campos son obligatorios."
        });
      }
  
      const user = await admin.auth().createUser({
        email,
        password,
        displayName: nombre_completo,
      });
  
      await admin.firestore().collection("Usuario").doc(user.uid).set({
        email,
        nombre_completo,
        rol,
        vigente: true,
        uid: user.uid,
      });
  
      return res.status(200).send({ uid: user.uid });
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      return res.status(500).send({
        error: "Error al crear el usuario",
        details: (error as Error).message
      });
    }
  });
  

exports.api = functions.https.onRequest(app);
