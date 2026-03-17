import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from './../../usuario/services/usuario.service';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Bcrypt } from '../bcrypt/bcrypt';
import { UsuarioLogin } from '../entities/usuariologin.entity';


@Injectable()
export class AuthService{
    constructor(
        private usuarioService: UsuarioService,
        private jwtService: JwtService,
        private bcrypt: Bcrypt
    ){ }

    async validateUser(username: string, password: string): Promise<any>{

        const buscaUsuario = await this.usuarioService.findByUsuario(username)

        if(!buscaUsuario)
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND)

        const matchPassword = await this.bcrypt.compararSenhas(password, buscaUsuario.senha)

        if(buscaUsuario && matchPassword){
            const { senha, ...resposta } = buscaUsuario
            return resposta
        }

        return null

    }

    async login(usuarioLogin: UsuarioLogin){

        const usuarioValidado = await this.validateUser(usuarioLogin.usuario, usuarioLogin.senha)

        if(!usuarioValidado)
            throw new HttpException('Usuário ou senha inválidos!', HttpStatus.UNAUTHORIZED)

        const payload = { sub: usuarioLogin.usuario }

        return{
            id: usuarioValidado.id,
            nome: usuarioValidado.nome,
            usuario: usuarioLogin.usuario,
            senha: '',
            foto: usuarioValidado.foto,
            token: `Bearer ${this.jwtService.sign(payload)}`,
        }

    }
}