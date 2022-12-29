import {FLUJOSCOMPLETOSCE} from "./E2e-Cedulas_clienteExiste"

const e2eCE = {
  datosUsuario: {
    emailCtaSimplificada:"ctaSimplificada03@yopmail.com", codeCtasimplificada: "495378",
    emailCtaAhorro: "	ctaAhorro02@yopmail.com", codeCtaAhorro: "452869",
    emailCtaEuro:"ctaeuros02@yopmail.com", codeCtaEuro: "948766",
    emailCtaCorriente: "ctaCorriente@yopmail.com", codeCtaCorriente: "736588",
    emailCtaMultipanama:"ctaMultipanama@yopmail.com", codeCtaMultipanama: "868467",
    emailCtaMultititular0: "testmultitular01@yopmail.com", codeCtaMultititular00: "338656",
    emailCtaMultititular1: "testmultitular02@yopmail.com", codeCtaMultititular01: "798778",
    emailCtaMultititular2: "testmultitular03@yopmail.com", codeCtaMultititular02: "857682",
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
    telefonoCelular: "4246556599",
    puntoReferencia: "LA ESCUELA SAN MARTIN DE POTOS",
  },
 
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

FLUJOSCOMPLETOSCE (e2eCE)
