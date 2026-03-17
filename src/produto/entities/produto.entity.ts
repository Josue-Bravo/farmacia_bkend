import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsUrl } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Categoria } from "../../categoria/entities/categoria.entity";
import { NumericTransformer } from "../../util/numerictransformer";

@Entity({name: "tb_produtos"})
export class Produto {

    @PrimaryGeneratedColumn()
    id: number;
    
    // Nome
    @Transform(({ value }: TransformFnParams) => value?.trim()) //Remover espaços em branco Inicio e Fim
    @IsNotEmpty()
    @Column({length: 100, nullable: false})
    nome: string;

    //Data de Lançamento
    @Column({type: "date", nullable: false})
    data_Validade: Date

    // Preço
    @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    transformer: new NumericTransformer(),
    nullable: false
    })
    preco: number;

    @Column({type: "int", nullable: false})
    quantidadeEmEstoque: number;

    // Link da imagem
    @Column({ length: 600, nullable: true})
    imagem: string;

    // ID da Categoria
    @ManyToOne(() => Categoria, (categoria) => categoria.produtos, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "categoria_id" })
    categoria: Categoria;
}