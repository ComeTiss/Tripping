
module.exports = (sequelize, DataType) => {
  const Trip = sequelize.define ('Trip', {
      title: {
        type: DataType.STRING
      },
      authorID: {
        type: DataType.INTEGER
      },
      visible: {
        type: DataType.BOOLEAN,
        defaultValue: true
      }
  })

  return Trip
};
