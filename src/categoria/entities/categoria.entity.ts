import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "tb_categorias"})
export class Categoria {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Transform(({ value }: TransformFnParams) => value?.trim()) //Remover espaços em branco Inicio e Fim
    @IsNotEmpty()
    @Column({length: 100, nullable: false, unique: true})
    nome: string;
}