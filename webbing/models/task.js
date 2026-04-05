import { DataTypes } from 'sequelize';
import sequelize from '../databaseconnection.js';

console.log("TASK MODEL LOADED");

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
      },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'tasks',
    timestamps: false
  }
);

export default Task;