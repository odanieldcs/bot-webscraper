export default (sequelize, DataType) => {
  const Products = sequelize.define(
    'products', {
      id: {
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      productML: {
        type: DataType.STRING(100),
        required: true,
      },
      name: {
        type: DataType.STRING(100),
        required: true,
      },
      price: {
        type: DataType.STRING(100),
        required: true,
      },
      shipping: {
        type: DataType.STRING(100),
        required: true,
      },
      url: {
        type: DataType.TEXT,
        required: true,
      },
    },
    {
      tableName: 'products',
    },
  );

  return Products;
};
