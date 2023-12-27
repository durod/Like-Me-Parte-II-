// para manejar variables de ambiente
import * as dotenv from "dotenv";
dotenv.config();

// importando modulos personalizados
import { handleErrors } from "./database/errors.js";
import {
  agregarPost,
  getPosts,
  like,
  eliminarPost,
} from "./database/consulta.js";

// importando express y cors
import express from "express";
const app = express();
import cors from "cors";

// middleware para parsear body enviado al servidor
app.use(express.json());
app.use(cors());

//// levantando servidor USANDO UN PUERTO PREDETERMINADO EN .ENV
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log("servidor listo en http://localhost:" + PORT);
});

// levantando servidor
/*const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server en puerto: http://localhost:${PORT}`);
})
*/

//rutas del enrutador/ Api Rest, enlazar ruta con funcion BD

//1. GET para ver todos los viajes registrados en la tabla Viajes
app.get("/posts", async (req, res) => {
  const posts = await getPosts();
  res.json(posts); //respuesta del servidor que es la respuesta que dio la funcion de consulta a BD
});

//2. POST para ingresar un viaje en la tabla Viajes
app.post("/posts", async (req, res) => {
  const { titulo, img, descripcion, likes } = req.body;
  try {
    console.log("valor req.body en la ruta /posts: ", req.body);
    await agregarPost({ titulo, img, descripcion, likes });
    res.send("Viaje agregado con éxito");
  } catch (error) {
    console.error("Error en la ruta /posts: ", error);
    res.status(400).send("Error al agregar el viaje: " + error.code);
  }
});

//3. PUT para modificar el post
// Ruta para dar like a un post específico
app.put("/posts/like/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const updatedPost = await like(postId);

    return res.status(200).json({
      ok: true,
      message: "*** Like agregado con éxito ***",
      result: updatedPost,
    });
  } catch (error) {
    console.error(
      "Error proveniente de respuesta de función likePost: ",
      error
    );
    console.error(
      "Error Code proveniente de respuesta de función likePost: ",
      error.code
    );

    const { status, message } = handleErrors(error.code);

    return res.status(status).json({
      ok: false,
      result: message + " : " + error.column,
    });
  }
});

//5. DELETE para eliminar un registro de la tabla segun ID

app.delete("/posts/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const result = await eliminarPost(postId);

    return res.status(200).json({
      ok: true,
      message: "*** Post eliminado con éxito ***",
      result,
    });
  } catch (error) {
    console.error(
      "Error proveniente de respuesta de función eliminarPost: ",
      error
    );
    console.error(
      "Error Code proveniente de respuesta de función eliminarPost: ",
      error.code
    );

    const { status, message } = handleErrors(error.code);

    return res.status(status).json({
      ok: false,
      result: message + " : " + error.column,
    });
  }
});

//0. GET para ver ruta raiz
app.use("*", (req, res) => {
  res.json({ ok: false, result: "404 Pagina no Encontrada" });
});
