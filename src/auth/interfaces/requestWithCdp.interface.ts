import { Request } from 'express';
import { Cdp } from "src/cdp/entities/cdp.entity";

interface RequestWithCdp extends Request {
  cdp: Cdp;
}

export default RequestWithCdp;