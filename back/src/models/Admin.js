import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Admin = sequelize.define("Admin", {
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

    role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "superadmin",
    validate: {
        isIn: [["superadmin", "gestor_productos", "auditor"]]
    }
}
}, {
  tableName: "admins",
  timestamps: false
});

export default Admin;

