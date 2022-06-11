import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "benjamingonzva",
  password: "postgres",
  database: "testAuthProspectix"
})
AppDataSource.initialize();
export default AppDataSource;
