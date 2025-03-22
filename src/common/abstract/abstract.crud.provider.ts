import {ConflictException, HttpException, HttpStatus, Injectable, Param} from '@nestjs/common';
import {AbstractBaseProvider} from "./abstract.base";
import {DeepPartial, DeleteResult, EntityManager, ObjectLiteral, Repository, UpdateResult} from "typeorm";
import {DeleteResponse} from "./types/deleted.interface";

@Injectable()
export class AbstractCrudProvider<T extends ObjectLiteral> extends AbstractBaseProvider<T> {
    protected constructor(repository:Repository<T>) {
        super(repository);

    }

    async createEntity(data:DeepPartial<T>, manager?:EntityManager): Promise<T> {
        const repo: Repository<T> = manager ? manager.getRepository<T>(this.repository.target) : this.repository;
        const entity = repo.create(data);
        try{
           return await repo.save<T>(entity)
        }catch(error){
            // TODO upgrade this
            if(error.code === `23505`) throw new ConflictException('⚠️ Entity already exists');
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateEntity(id:number, data:Partial<T>, manager?:EntityManager): Promise<T> {
        const repo: Repository<T> = manager ? manager.getRepository<T>(this.repository.target) : this.repository;
        await this.findOneByIdOrEmail(id,manager);
        // Vérification explicite de l'existence de l'entité
        const entity = await this.findOneByIdOrEmail(id, manager);
        if (!entity) {
            console.error("Entity not found");
            throw new HttpException({
                success: false,
                message: "Entity not found"
            }, HttpStatus.NOT_FOUND); // ou HttpStatus.INTERNAL_SERVER_ERROR selon le contexte
        }
        const updatedEntity :UpdateResult = await repo.update(id,data);
        if(updatedEntity.affected === 0) {
            console.error("Failed to update entity");
            throw new HttpException({
                success: false,
                message:"Failed to update entity"
            },HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return this.findOneByIdOrEmail(id,manager);
    }

    async deleteEntity(id:number, manager?:EntityManager):Promise<DeleteResponse> {
        const repo:Repository<T>= manager ? manager.getRepository<T>(this.repository.target) : this.repository;
        const result :DeleteResult = await repo.delete(id);
        if(result.affected === 0) {
            console.error("Failed to delete entity");
            throw new HttpException({
                success: false,
                message:"Failed to delete entity"
            },HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return {
            message: `Entity with ID${id} was successfully deleted`,
            success: true,
            date: new Date(),
        }
    }

}

