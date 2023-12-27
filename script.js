const tbody = document.querySelector("tbody")

const getProducts = async () => {
    alert("entro en getProducts para conexion a Backend")
    //const res = await fetch("http://localhost:3000/posts") //conectando a una ruta del backend
    const res = await fetch("/posts") //conectando a una ruta del backend
    const productos = await res.json()
    console.log("Valor devuelto del back al front: ", productos)
    return productos
}

const fillTableWithProducts = async () => {
    const productos = await getProducts()
    tbody.innerHTML = ""
    productos.result.forEach(product => {
        tbody.innerHTML += `
                <tr>
                    <th>${product.id}</th>
                    <td>${product.titulo}</td>
                    <td>${product.imgSrc}</td>
                    <td>${product.descripcion}</td>
                </tr >
                `
    })
}

 fillTableWithProducts()