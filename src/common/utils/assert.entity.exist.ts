import {HttpException, HttpStatus} from "@nestjs/common";

export function assertEntityExist<T>(entity:T,message?: string){
    if(!entity){
        throw new HttpException({
            message: message ?? "'Entity not found'"
        }, HttpStatus.NOT_FOUND);
    }
}