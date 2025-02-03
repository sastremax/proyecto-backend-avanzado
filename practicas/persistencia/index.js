import UserManager from './UsersManager.js';

const userManager = new UserManager();

async function Main() {
    try {
        await userManager.crearUsuario(
            {
                nombre: "Maxi",
                apellido: "Sastre",
                edad: 48,
                curso: "programacion backend"
            }
        );
        // consultar usuarios
        let usuarios = await userManager.leerUsuario();
        console.log("usuarios: ", usuarios);
    } catch (error) {
        console.error("error en la aplciacion");
    }

}

Main();
