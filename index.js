import express from 'express';
import fs from 'fs';

const app = express();

const server = app.listen(8080,()=>console.log("listening on express"))

//ENDPOINTS

app.get('/', (req, res)=>{
    res.send('Frionel Pechi')
})

app.get('/productos', async (req , res) => {
    const contenedor = new Contenedor();
    contenedor.getAll().then((response) => {
        res.send(response)
    })
    
})

app.get('/productos/:productosId',async (req,res)=>{
    const id = parseInt(req.params.productosId);
    console.log(typeof id);
    let data =  await fs.promises.readFile(pathToFile, "utf-8");
    let productos = JSON.parse(data);
    const filter = productos.filter(u => u.id===id)
    if(filter[0]){
        res.send({user:filter[0]})
    }
    else{
        res.send({status:"error",message:"No encontré al usuario"})
    }
})




const pathToFile = "./productos.json"

class Contenedor {
    save = async (producto) => {
        if(!producto.tittle || !producto.price || !producto.thumbnail ){
            return{
                status : "error" ,
                message : "Missing required fields"
            }
        }
        try {
            if(fs.existsSync(pathToFile)){
                let data =  await fs.promises.readFile(pathToFile, "utf-8");
                let productos = JSON.parse(data);
                let id = productos.length + 1
                producto.id = id
                productos.push(producto)
                await fs.promises.writeFile(pathToFile , JSON.stringify(productos, null, 2))
                return{
                    status: "success" ,
                    message: "User created succesfully"
                }
            } else {
                producto.id = 1;
                await fs.promises.writeFile(
                    pathToFile,
                    JSON.stringify([producto], null, 2)
                )
                return{
                    status: "success" ,
                    message: "User created succesfully"
                }
            }
        } catch(error){
            return{
                status: "error" ,
                message: error.message
            }
        }
    }

    getAll = async () => {
        try {
            if(fs.existsSync(pathToFile)){
                let data =  await fs.promises.readFile(pathToFile, "utf-8");
                let productos = JSON.parse(data);
                return{
                    status: "success" ,
                    message: productos,
                }
            } else {
                return{
                    status: "error" ,
                    message: "no products found",
                }
            }
        } catch (error){
            return{
                status: "error" ,
                message: error.message,
            }
        }
    }

    getById = async(id) => {
        if (!id){
            return{
                status: "error" ,
                message: "ID is required",
            }
        }
        if(fs.existsSync(pathToFile)){
            let data =  await fs.promises.readFile(pathToFile, "utf-8");
            let productos = JSON.parse(data);
            let producto = productos.find((producto) => producto.id == id)
            if (producto){
                return{
                    status: "success" ,
                    message: producto,
                }
            } else {
                return{
                    status: "error" ,
                    message: "User not found",
                }
            }
             
        } else {
            return{
                status: "error" ,
                message: "No users found",
            }
        }
    }

    deleteById = async (id) => {
        if (!id){
            return{
                status: "error" ,
                message: "ID is required",
            }
        }
        if(fs.existsSync(pathToFile)){
            let data =  await fs.promises.readFile(pathToFile, "utf-8");
            let productos = JSON.parse(data);
            let newProductos = productos.filter((producto) => producto.id != id)
            await fs.promises.writeFile(
                pathToFile,
                JSON.stringify(newProductos , null , 2)
            );
            return{
                status: "success" ,
                message: "product deleted",
            }
        } else {
            return{
                status: "error" ,
                message: "No products found",
            }
        }
    }

    deleteAll = async () => {
        if(fs.existsSync(pathToFile)){
            let newProductos = []
            await fs.promises.writeFile(
                pathToFile,
                JSON.stringify(newProductos , null , 2)
            );
            return{
                status: "success" ,
                message: "All products deleted",
            }
        } else {
            return{
                status: "error" ,
                message: "No products found",
            }
        }
    }

}
export default Contenedor;