import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Client = sequelize.define("Client", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  direccion: {
    type: DataTypes.STRING,
    allowNull: true
  },

  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: "clients",
  timestamps: false
});

export default Client;

