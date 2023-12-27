// La clase Pool nos permite soportar multiconexiones y un mejor rendimiento en las consultas desde paquete pg
import pkg from 'pg';
const { Pool } = pkg;

// definimos el objeto de conexion pool
/*const pool = new Pool({
    host: 'localhost',  //servidor local de maquina
    user: 'postgres',
    password: '1234',  // el password de cada no
    database: 'likeme', // DB debe existir
    
    allowExitOnIdle: true  // cerrar sesion de conexion despues de cada consulta
})
*/

// haremos uso del archivo .ENV
const pool = new Pool({
    allowExitOnIdle: true,
  });


// funcion para insertar un viaje en la tabla en forma de parametros
const agregarPost = async ({ titulo, img, descripcion, likes }) => {
    console.log("Entro agregarPost: ", titulo, img, descripcion, likes);
  
    // Validación por si falta información principal del body
    if (!titulo || !img || !descripcion || likes === undefined) {
      throw { code: "400" }; // Respuesta de la función
    }
  
    const consulta = "INSERT INTO posts VALUES (DEFAULT, $1, $2, $3, $4) RETURNING *";
    const values = [titulo, img, descripcion, likes];
  
    const result = await pool.query(consulta, values);
  
    console.log("---------------------------------------------------------------");
    console.log("Post agregado");
    console.log("Objeto devuelto de la consulta: ", result);
    console.log("Filas procesadas: ", result.rowCount);
    console.log("Información ingresada: ", result.rows[0]);
    console.log("----------------------------------------------------------------");
  };
  


// funcion listar el contenido de la tabla
const getPosts = async () => {
    const { rows, command, rowCount, fields } = await pool.query("SELECT * FROM posts"); //destructuring
    console.log("----------------------------------------------")
    console.log("Viajes registrados en la tabla")
    console.log("Instruccion procesada: ", command)
    console.log("Filas procesadas: ",rowCount)
    console.log("Contenido procesado: ", rows)
    console.log("Campos procesados: ",fields)
    console.log("----------------------------------------------")
    
    return rows  // aqui si la funcion esta retornando algo
};


// FUNCION PARA MODIFICAR UN REGISTRO DE LA TABLA

const like = async (postId) => {
    const consulta = "UPDATE posts SET likes = likes + 1 WHERE id = $1";
    const values = [postId];
    try {
        const result = await pool.query(consulta, values);

        // Validación por si retorna rowCount con valor cero
        if (result.rowCount === 0) {
            throw { code: "404" }; // Respuesta de la función si no encuentra el registro
        }

        // Verificar si la propiedad 'likes' está presente en la respuesta
        const updatedLikes = result.rows[0]?.likes;

        if (updatedLikes === undefined) {
            throw { code: "500", message: "No se encontró la propiedad 'likes' en la respuesta" };
        }

        return { id: postId, likes: updatedLikes }; // Respuesta de la función si encuentra y modifica
    } catch (error) {
        console.error("Error proveniente de respuesta de función likePost: ", error);
        console.error("Error Code proveniente de respuesta de función likePost: ", error.code);

        throw error; // Propagar el error hacia arriba
    }
};

// FUNCION PARA ELIMINAR UN REGISTRO DE LA TABLA

const eliminarPost = async (postId) => {
    try {
        const consulta = "DELETE FROM posts WHERE id = $1";
        const values = [postId];
        const result = await pool.query(consulta, values);

        // Validación por si retorna rowCount con valor cero
        if (result.rowCount === 0) {
            throw { code: "404" }; // Respuesta de la función si no encuentra el registro
        }

        return postId; // Respuesta de la función si encuentra y elimina
    } catch (error) {
        console.error("Error en la función eliminarPost: ", error);
        throw error; // Propagar el error hacia arriba
    }
};


export {agregarPost, getPosts, like, eliminarPost}  // exportacion nombrada de las funciones de consulta a la bd