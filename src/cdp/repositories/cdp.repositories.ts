import AppDataSource from "src/app-data-source";
import { Cdp } from "../entities/cdp.entity";

export const CdpRepository = AppDataSource.manager.getRepository(Cdp);