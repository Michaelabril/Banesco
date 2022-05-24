/*import {LOGUIN} from "./caso1_loguinValidaciones";
import {PROD_TEMPLATES} from "./caso2_templatesProductos";
import {KOPEP} from "./caso3-koPep_koFampep";
import {OCR} from "./caso4_ocr";
import {APPTIVIDAD} from "./caso5_apptividad";
import { BIOMETRIA } from "./caso6-BiometriaKO";*/
import { DIRECCION } from "./caso7-Direccion";
import { TDD } from "./caso8-tdd";
import { DECLARACIONJURADA } from "./caso9-declaracionJurada";

const loguin = {
  datosUsuario: {
    email: "prueba179@yopmail.com",
    code: "898588",
    emailfalso: "noemi@correofalso.com",
  },
};

const Tem_Productos = {
  datosUsuario: {
    emailSimplificada: "csimplificada@yopmail.com",
    codesimplificada: "588769",
    emailAhorro: "cahorro@yopmail.com",
    codeAhorro: "542832",
    emailEuros: "ceuros@yopmail.com",
    codeEuros: "877448",
    emailCorriente: "ccorriente@yopmail.com",
    codeCorriente: "393728",
    emailmultipanama: "cmultipanama@yopmail.com",
    codemultipanama: "942786",
    emailmultitular: "cmultititular@yopmail.com",
    codeMultititular: "767859",
  },
};

const casepep = {
  datosUsuario: {
    emailfampep: "prueba178@yopmail.com",
    codefampep: "323285",
    email: "prueba177@yopmail.com",
    code: "269252",
  },
};

const ocr = {
  datosUsuario: {
    email: "ocrtest@yopmail.com",
    code: "293947",
    nombres: "Michael Alejandro",
    apellidos: "Abril Marmolejo",
    fechaNacimiento: "13061994",
    fechaexpedicion: "12122020",
    fechaVencimiento: "12122030",
    numeroRif: "V-23456756-2",
  },
};

const apptividad = {
  datosUsuario: {
    email: "apptividad@yopmail.com",
    code: "552285",
    nombres: "Michael Alejandro",
    apellidos: "Abril Marmolejo",
    fechaNacimiento: "13061994",
    fechaexpedicion: "12122020",
    fechaVencimiento: "12122030",
    numeroRif: "V-23456756-2",
  },
};

const biometria = {
  datosUsuario: {
    email: "biometria@yopmail.com",
    code: "523462",
    nombres: "Michael Alejandro",
    apellidos: "Abril Marmolejo",
    fechaNacimiento: "13061994",
    fechaexpedicion: "12122020",
    fechaVencimiento: "12122030",
    numeroRif: "V-23456756-2",
  },
};

const direccion = {
  datosUsuario: {
    email: "direccion@yopmail.com",
    code: "779376",
    nombres: "Michael Alejandro",
    apellidos: "Abril Marmolejo",
    fechaNacimiento: "13061994",
    fechaexpedicion: "12122020",
    fechaVencimiento: "12122030",
    numeroRif: "V-23456756-2",
  },

  direccion: {
    urbanizacion: "SAN CRISTOBAL DE LA NUEVA GRAN",
    calle: "CALLE 4K CON AVENIDAD PRINCIPAL 22S",
    edificio: "EDIFICIO LOS ALTOS DE TORRE DE SOL ",
    casa: "CASA 45 PI",
    telefonoResidencial: "2136565654",
    telefonoCelular: "4246556565",
    puntoReferencia: "LA ESCUELA SAN MARTIN DE POTOS",
  },
};

const tdd = {
  datosUsuario: {
    email: "tdd@yopmail.com",
    code: "779376",
    nombres: "Michael Alejandro",
    apellidos: "Abril Marmolejo",
    fechaNacimiento: "13061994",
    fechaexpedicion: "12122020",
    fechaVencimiento: "12122030",
    numeroRif: "V-23456756-2",
  },

  direccion: {
    urbanizacion: "SAN CRISTOBAL DE LA NUEVA GRAN",
    calle: "CALLE 4K CON AVENIDAD PRINCIPAL 22S",
    edificio: "EDIFICIO LOS ALTOS DE TORRE DE SOL ",
    casa: "CASA 45 PI",
    telefonoResidencial: "2136565654",
    telefonoCelular: "4246556565",
    puntoReferencia: "LA ESCUELA SAN MARTIN DE POTOS",
  },
  tdd: {},
};

const declaracionJurada = {
  datosUsuario: {
    email: "declaracionJurada@yopmail.com",
    code: "298673",
    nombres: "Michael Alejandro",
    apellidos: "Abril Marmolejo",
    fechaNacimiento: "13061994",
    fechaexpedicion: "12122020",
    fechaVencimiento: "12122030",
    numeroRif: "V-23456756-2",
  },

  direccion: {
    urbanizacion: "SAN CRISTOBAL DE LA NUEVA GRAN",
    calle: "CALLE 4K CON AVENIDAD PRINCIPAL 22S",
    edificio: "EDIFICIO LOS ALTOS DE TORRE DE SOL ",
    casa: "CASA 45 PI",
    telefonoResidencial: "2136565654",
    telefonoCelular: "4246556565",
    puntoReferencia: "LA ESCUELA SAN MARTIN DE POTOS",
  },
  tdd: {},

  declaracion: {
    situacionLaboralOp: "Asalariado",
    situacionLaboralValue: "ASA",
    tipoNegocioOp: "Empresas Financieras",
    tipoNegocioValue: "3100",
    ocupacionRiesgo: "Juez Fiscal",
    ocupacionRiesgoValue: "1183",
    ocupacionOp: "Banquero",
    ocupacionValue: "1048",
    salario: "3687",
    descripcionOtrosIngresos: "Ingresos varios",
    montoOtrosIngresos: "120",
    montoApertura:"20000",
    estadoCivilOp: "Casado(a)",
    estadoCivilValue: "MARRIED",
  },
};
var planilla = [declaracionJurada, casepep];
/*LOGUIN(loguin)
PROD_TEMPLATES(Tem_Productos)
KOPEP(casepep)
OCR(ocr)
APPTIVIDAD(apptividad)
BIOMETRIA(biometria)
DIRECCION(direccion);
TDD(tdd);*/
DECLARACIONJURADA(declaracionJurada);
//PLANILLA(planilla)
