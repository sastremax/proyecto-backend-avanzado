import mongoose from "mongoose";
import dotenv from "dotenv";
import orderModel from "./models/order.js";

dotenv.config();

const checkData = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB Atlas");

    const mediumPizzas = await orderModel.find({ size: "medium" });

    console.log("Pizzas medianas en la base de datos:");
    console.log(mediumPizzas);

    mongoose.disconnect();
};

const runAggregation = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Conectado a MongoDB Atlas");

        let results = await orderModel.aggregate([
            {
                // Filtrar solo las órdenes de pizzas medianas
                $match: { size: "medium" }
            },
            {
                // Agrupar por sabor y contar cuántas se vendieron
                $group: {
                    _id: "$flavor",
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            {
                // Ordenar de mayor a menor según total de ventas
                $sort: { totalQuantity: -1 }
            }
        ]);

        console.log("Reporte de ventas de pizzas medianas:");
        console.log(results);

        mongoose.disconnect();
    } catch (error) {
        console.error("Error al ejecutar el aggregation:", error);
        mongoose.disconnect();
    }
};

runAggregation();