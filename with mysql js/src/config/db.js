import { Sequelize } from "sequelize";
import logger from "../utils/logger.js";

export const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USERNAME, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        logger.info("Connection has been established successfully");

        await sequelize.sync({ force: false });
        logger.info("Database synchronized successfully.");

    } catch (error) {
        logger.error("MySql connection error:", error);
        process.exit(1)
    }
}

export default connectDB;