import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localHost",
      port: 3307, // Meu MySQL está rodando na porta 3307. Favor ajustar conforme necessário
      username: "root", // O usuário padrão do MySQL é "root". Favor ajustar conforme necessário
      password: "root", // A senha padrão do MySQL é "root". Favor ajustar conforme necessário
      database: "db_farmacia", // Crie um banco de dados chamado "db_farmacia" no MySQL
      entities: [__dirname + '/**/*.entity{.ts}'], //Procurar por arquivos de forma recursiva
      synchronize: true
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
