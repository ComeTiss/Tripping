module.exports = (sequelize, DataType) => {
  const Destination = sequelize.define('Destination', {
    tripId: {
      type: DataType.INTEGER
    },
    authorId: {
      type: DataType.INTEGER
    },
    title: {
      type: DataType.STRING
    },
    content: {
      type: DataType.STRING
    },
    longCoord: {
      type: DataType.DOUBLE
    },
    latCoord: {
      type: DataType.DOUBLE
    },
    icon: {
      type: DataType.STRING
    }
  })

  return Destination
}
