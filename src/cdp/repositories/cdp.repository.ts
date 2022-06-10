import { EntityRepository, Repository } from "typeorm";
import { Cdp } from "../entities/cdp.entity";

@EntityRepository()
export class CdpRepository extends Repository<Cdp>{
  
}