import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Produto } from "../../produto/entities/produto.entity";

@Entity({name: "tb_categorias"})
export class Categoria {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Transform(({ value }: TransformFnParams) => value?.trim()) //Remover espaços em branco Inicio e Fim
    @IsNotEmpty()
    @Column({length: 100, nullable: false, unique: true})
    nome: string;

    @OneToMany(() => Produto, (produto) => produto.categoria)
    produtos: Produto[]
    
}