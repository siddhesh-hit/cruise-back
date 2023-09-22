module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "sidd@123",
  DB: "cruise",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
