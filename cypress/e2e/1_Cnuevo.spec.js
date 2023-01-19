import { FLUJOSCOMPLETOS } from "./E2e-Cedulas_cliente Nuevo"

const e2e = {
  datosUsuario: {
    emailCtaAhorro: "ctaAhorro07@yopmail.com", codeCtaAhorro: "744262",
    emailCtaEuro: "ctaEuros044@yopmail.com", codeCtaEuro: "397928",
    emailCtaCorriente: "ctaCorriente04@yopmail.com", codeCtaCorriente: "992957",
    emailCtaMultipanama: "ctaMultipanama08@yopmail.com", codeCtaMultipanama: "677944",
    emailCtaSimplificada: "mabriltest199@yopmail.com", codeCtasimplificada: "844867",
    emailCtaMenorEdad: "mabrilhn1994l@yopmail.com", codeCtaMenorEdad: "842747",
    emailfatcaPep: "fatcapepfampepcrs@yopmail.com	", codefatcaPep: "549882",
    emailCtaMultititular0: "multititularcrs@yopmail.com", codeCtaMultititular00: "469449",
    emailCtaMultititular1: "multititularcrs4@yopmail.com", codeCtaMultititular01: "566792",
    nombres: "MARIA CARMEN",
    nombre2: " OMAIRA",
    apellidos: "DE LA TORRE ",
    apellido2: "PAZ ",
    ApellidoCasada: "DE RODRIGUEZ",
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
  ValidateDataMenor: {
    PrimerNombreMenor:"Michael",
    SegundoNombreMenor: "Alejandro",
    PrimerApellidoMenor:"Abril",
    SegundoApellidoMenor: "Marmolejo",
    FechaNacimientoMenor: "13062017",
    GeneroMenor: "Masculino",
    NacionalidadMenor: "VENEZOLANA",
    PaisDocumentoMenor: "VENEZUELA",
    PasaporteMenor: "AC238108",
    CedulaMenor: "V976474647",
    FechaExpedicionMenor: "12122020",
    FechaVencimientoMenor: "12122030",
    PaisNacimientoMenor: "VENEZUELA"
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

FLUJOSCOMPLETOS(e2e)