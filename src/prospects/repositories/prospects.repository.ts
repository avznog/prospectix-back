import { EntityRepository, Repository } from 'typeorm';
import { Prospect } from '../entities/prospect.entity';

@Repository(Prospect)
export class ProspectsRepository extends Repository<Prospect> {}
