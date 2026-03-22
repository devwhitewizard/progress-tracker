import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const UserData = sequelize.define('UserData', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  goals: {
    type: DataTypes.JSON,
    defaultValue: { daily: {}, weekly: { 1: { goals: [] }, 2: { goals: [] }, 3: { goals: [] } }, yearly: { 2026: { goals: [] } } }
  },
  habits: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  history: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  isDarkMode: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

// Setup 1-to-1 relationship with User
User.hasOne(UserData, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserData.belongsTo(User, { foreignKey: 'userId' });

export default UserData;
