import {Injectable, NotFoundException} from '@nestjs/common';
import {EntityManager, FindOptionsWhere, ObjectLiteral, Repository} from "typeorm";
import {IPagination, ResultWithPagination} from "./types/result-with.pagination";

@Injectable()
export class AbstractBaseProvider<T extends ObjectLiteral> {
    protected constructor(protected readonly repository: Repository<T>) {}

    async findOneById(id:number, manager?:EntityManager): Promise<T> {
        const repo = manager ? manager.getRepository(this.repository.target) : this.repository;
        const entity: T | null = await repo.findOne({where:{id:id} as any, lock:{mode:"pessimistic_read"}});
        const errorMessage = `Entity with ID:${id} does not exist`;
        if(!entity) throw new NotFoundException(`Entity ID ${id} not found ❌`);
        return entity;
    }

    async findByCondition(condition:FindOptionsWhere<T>, manager?:EntityManager): Promise<T> {
        const repo: Repository<T> = manager ? manager.getRepository(this.repository.target) : this.repository;
        const entity :T|null = await repo.findOne({where:condition});
        if(!entity)  throw new NotFoundException(`Entity not found with condition: ${JSON.stringify(condition)} ❌`);
        return entity;
    }

    async findAll(pagination:IPagination<T>):Promise<ResultWithPagination<T>> {
        const {page, limit, filter} = pagination;
        const [data, total] = await this.repository.findAndCount({
            where: filter,
            skip: (page-1)*limit,
            take:limit,
            order:{createdAt: "DES"} as any,
        })
        return {
            data,
            total,
            page,
            limit,
        }
    }

    async findOneByIdOrEmail(idOrEmail: number | string, manager?: EntityManager): Promise<T> {
           const whereCondition: FindOptionsWhere<T> =
            typeof idOrEmail === 'number' ? { id: idOrEmail } as any
                : { email: idOrEmail } as any;

        return this.findByCondition(whereCondition, manager);
    }
}
