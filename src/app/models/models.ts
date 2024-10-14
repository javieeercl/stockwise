export interface Usuario {
  email: string;
  password: string;
  uid: string;
  rol: string;
  nombre_completo: string;
  vigente: boolean;
}

export interface Tecnologia {
  id: string;
  nombre: string;
  nivel: undefined;
  imagenUrl: any;
  vigente: boolean;
}

export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  imagenUrl: any;
  vigente: boolean;
}

export interface Contacto {
  id: string;
  idUsuario: string;
  nombreUsuario: string;
  emailUsuario: string;
  tipo: string;
  descripcion: string;
}
