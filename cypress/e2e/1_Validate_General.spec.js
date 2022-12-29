import {LOGUIN} from "./caso1_loguinValidaciones";
import {PROD_TEMPLATES} from "./caso2_templatesProductos";
import {KOPEP} from "./caso3-koPep_koFampep";
import {OCR} from "./caso4_ocr";
import {APPTIVIDAD} from "./caso5_apptividad";
import { BIOMETRIA } from "./caso6-BiometriaKO";
import { DIRECCION } from "./caso7-Direccion";
import { TDD } from "./caso8-tdd";
import { DECLARACIONJURADA } from "./caso9-declaracionJurada";
import { BENEFICIARIOS } from "./caso10-beneficiarios";

const loguin = {
  datosUsuario: {
    email: "prueba179@yopmail.com",
    code: "689329",
    emailfalso: "test@correofalso.com",
  },
};

const Tem_Productos = {
  datosUsuario: {
    emailSimplificada: "csimplificada@yopmail.com",
    codesimplificada: "667547",
    emailAhorro: "cahorro@yopmail.com",
    codeAhorro: "592359",
    emailEuros: "ceuros@yopmail.com",
    codeEuros: "838499",
    emailCorriente: "ccorriente@yopmail.com",
    codeCorriente: "639976",
    emailmultipanama: "cmultipanama@yopmail.com",
    codemultipanama: "474494",
    emailmultitular: "cmultititular@yopmail.com",
    codeMultititular: "949852"
  },
};

const casepep = {
  datosUsuario: {
    emailfampep: "prueba178@yopmail.com",
    codefampep: "377456",
    email: "prueba177@yopmail.com",
    code: "562872",
  },
};

const ocr = {
  datosUsuario: {
    email: "ocrtest@yopmail.com",
    code: "486532",
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
    code: "969655",
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
    code: "447324",
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
    code: "565864",
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
    code: "472828",
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
    code: "792947",
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
    montoApertura: "20000",
    estadoCivilOp: "Casado(a)",
    estadoCivilValue: "MARRIED",
  },
};

const beneficiarios = {
  datosUsuario: {
    email: "beneficiarios@yopmail.com",
    code: "876597",
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
    montoApertura: "20000",
    estadoCivilOp: "Casado(a)",
    estadoCivilValue: "MARRIED",
  },

  beneficiariosData: {
    Bnombres: "Michael Alejandro    ",
    Bapellidos: "Abril Marmolejo",
    BfechaNacimiento: "1994-06-06",
    Bporcentaje: "100",
    Bidentificacion: "CC11116263511",
    Btelefono: "3154258963",
    Bemail: "mabril@test.com",
  },
};

var planilla = [declaracionJurada, casepep];
LOGUIN(loguin)
PROD_TEMPLATES(Tem_Productos)
KOPEP(casepep)
OCR(ocr)
APPTIVIDAD(apptividad)
BIOMETRIA(biometria)
DIRECCION(direccion);
TDD(tdd);
DECLARACIONJURADA(declaracionJurada);
BENEFICIARIOS(beneficiarios);
