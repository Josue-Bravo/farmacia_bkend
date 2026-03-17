import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Produto } from "../entities/produto.entity";
import { ILike, LessThan, MoreThan, Repository } from "typeorm";
import { CategoriaService } from "../../categoria/services/categoria.service";
import { DeleteResult } from "typeorm";
@Injectable()
export class ProdutoService {
    
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,
        private categoriaService: CategoriaService
    ){}

    async findAll(): Promise<Produto[]>{
        return this.produtoRepository.find({
            relations:{
                categoria: true,
                
            }
        })
    }

    async findById(id: number): Promise<Produto>{
        const produto = await this.produtoRepository.findOne({
            where:{
                id
            },
            relations:{
                categoria: true,
                
            }
        })

        if (!produto)
            throw new HttpException("Produto não encontrado!", HttpStatus.NOT_FOUND);
        return produto
    }

    async findAllByNome(nome: string): Promise<Produto[]>{
        return this.produtoRepository.find({
            where:{
                nome: ILike(`%${nome}%`)
            },
            relations:{
                categoria: true,
                
            }
        })
    }

    async findByPrecoMaiorQue(preco: number): Promise<Produto[]> {
    return this.produtoRepository.find({
        where: {
            preco: MoreThan(preco)
        },
        relations: {
            categoria: true,
            
        },
        order: {
            preco: "ASC"
        }
        })
    }

    async findByPrecoMenorQue(preco: number): Promise<Produto[]> {
    return this.produtoRepository.find({
        where: {
            preco: LessThan(preco)
        },
        relations: {
            categoria: true,
            
        },
        order: {
            preco: "DESC"
        }
        })
    }

    async create(produto: Produto): Promise<Produto>{

        if (produto.categoria){

            const categoria = await this.categoriaService.findById(produto.categoria.id)

            if (!categoria)
                throw new HttpException("Categoria não encontrada", HttpStatus.NOT_FOUND)

        }

        if (produto.imagem == null || produto.imagem == undefined){
            produto.imagem = "Nenhuma imagem anexada."
        }

        return this.produtoRepository.save(produto)
    }

    async update(produto: Produto): Promise<Produto>{

        if (!produto.id || produto.id <= 0){
            throw new HttpException("Id inválido", HttpStatus.BAD_REQUEST)
        }
        await this.findById(produto.id)

        if (produto.categoria?.id){

            const categoria = await this.categoriaService.findById(produto.categoria.id)

            if (!categoria){throw new HttpException("Categoria não encontrada.", HttpStatus.NOT_FOUND)}
        }

        if (produto.imagem == null || produto.imagem == undefined){
            produto.imagem = "Nenhuma imagem anexada."
        }

        return this.produtoRepository.save(produto)
    }

    async delete(id: number): Promise<DeleteResult>{
        await this.findById(id)

        return this.produtoRepository.delete(id)
    }
}