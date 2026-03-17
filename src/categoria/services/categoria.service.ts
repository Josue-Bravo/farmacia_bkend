import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Categoria } from "../entities/categoria.entity";
import { ILike, Repository } from "typeorm";
import { DeleteResult } from "typeorm";

@Injectable()
export class CategoriaService {
    constructor(
        @InjectRepository(Categoria)
        private categoriaRepository: Repository<Categoria>
    ){}

    async findAll(): Promise<Categoria[]>{
        return await this.categoriaRepository.find({
            relations:{
                produtos: true
            }
        })
    }

    async findById(id: number): Promise<Categoria>{
        const categoria = await this.categoriaRepository.findOne({
            where:{
                id: id
            },
            relations:{
                produtos: true
            }
        })

        if (!categoria) 
            throw new HttpException("Categoria não encontrada", HttpStatus.NOT_FOUND);
       
        return categoria
    }

    async findAllByNome(nome: string): Promise<Categoria[]>{

        return this.categoriaRepository.find({
            where:{
                nome: ILike(`%${nome}%`)
            },
            relations:{
                produtos: true
            }
        })
    }

    async create(categoria: Categoria): Promise<Categoria>{
        return this.categoriaRepository.save(categoria)
    }

    async update(categoria: Categoria): Promise<Categoria>{

        if (!categoria.id || categoria.id <= 0)
            throw new HttpException("Id inválido", HttpStatus.BAD_REQUEST)

        await this.findById(categoria.id);
       
        return this.categoriaRepository.save(categoria)
    }

    async delete(id: number): Promise<DeleteResult>{
        await this.findById(id)

        return this.categoriaRepository.delete(id)
    }
}