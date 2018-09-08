export default (sequelize, DataType) => {
  const Pages = sequelize.define(
    'pages', {
      id: {
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      url: {
        type: DataType.TEXT,
        required: true,
      },
      read: {
        type: DataType.BOOLEAN,
        default: false,
      },
    },
    {
      tableName: 'pages',
    },
  );

  return Pages;
};
