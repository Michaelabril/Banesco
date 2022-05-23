/*import {LOGUIN} from "./caso1_loguinValidaciones";
import {PROD_TEMPLATES} from "./caso2_templatesProductos.js";
import {KOPEP} from "./caso3-koPep_koFampep.JS";
import {OCR} from "./caso4_ocr";*/
import {APPTIVIDAD} from "./caso5_apptividad";
//import { IntentosBiometria } from "./caso7-BiometriaKO.js";
//import { KOFATCAPEP } from "./caso4-KOFATCAPEP";

const loguin = {
    datosUsuario: {
        email: "prueba179@yopmail.com", code: "898588",
        emailfalso: "noemi@correofalso.com"
    }
};

const Tem_Productos = {
    datosUsuario: {
        emailSimplificada:"csimplificada@yopmail.com", codesimplificada: "588769",
        emailAhorro:"cahorro@yopmail.com",codeAhorro: "542832",
        emailEuros:"ceuros@yopmail.com",codeEuros: "877448",
        emailCorriente:"ccorriente@yopmail.com",codeCorriente: "393728",
        emailmultipanama:"cmultipanama@yopmail.com",codemultipanama: "942786",
        emailmultitular:"cmultititular@yopmail.com",codeMultititular: "767859",
    },
};

const casepep = {
    datosUsuario: {
        emailfampep:"prueba178@yopmail.com", codefampep: "323285",
        email:"prueba177@yopmail.com", code: "269252"
    },
};

const ocr = {
    datosUsuario: {
        email:"ocrtest@yopmail.com", code: "293947",
        nombres:"Michael Alejandro",
        apellidos:"Abril Marmolejo",
        fechaNacimiento:"13061994",
        fechaexpedicion:"12122020",
        fechaVencimiento:"12122030",
        numeroRif:"V-23456756-2"
    }
};

const apptividad = {
    datosUsuario: {
        email:"apptividad@yopmail.com", code: "552285",
        nombres:"Michael Alejandro",
        apellidos:"Abril Marmolejo",
        fechaNacimiento:"13061994",
        fechaexpedicion:"12122020",
        fechaVencimiento:"12122030",
        numeroRif:"V-23456756-2"
    },
};

const Data_generica = {
    datosUsuario: {
        email: "prueba179@yopmail.com",
        code: "655358",
        emailfalso: "noemi@correofalso.com"
    },

    direccion: {
       cellphone: '68974929',
      // sucursalOp1: 'Sucursal 12 De Octubre',  CAMBIAR EN EL FLUJO 
     //  sucursalValueOp1: 'PA0010012',   CAMBIAR EN EL FLUJO 
        sucursalOp: 'Sucursal Altos De Panama',   //posición 2 en el arreglo
        sucursalValue: 'PA0010024',
        // sucursalOp: 'Sucursal Santiago',           //posicion 20 en el arreglo
        // sucursalValue: 'PA0010009',
        // sucursalOp: 'Sucursal Via Espana',          //posición 21 en el arreglo
        // sucursalValue: 'PA0010006',
       direccionGeo: 'Los santos',
       direccionGeoOp: 'Los Santos, Avenida Doctor Belisario Porras',
       ProvinciaOp: 'Los Santos',
       ProvinciaValue: 'PA07',
       distritoOp: 'Los Santos',
       distritoValue: '8039',
       corregimientoOp: 'La Villa De Los Santos',
       corregimientoValue: '8524',
       calle: 'Avenida Doctor Belisario Porra',
       barriada: 'Alto de la Villa',
       casa: 'Casa 2457',
    },

    declaracionJurada: {
        situacionLaboralOp: 'Asalariado',
        situacionLaboralValue: 'ASA',
        tipoNegocioOp: 'Empresas Financieras',
        tipoNegocioValue: '3100',
        ocupacionRiesgo: 'Juez Fiscal',
        ocupacionRiesgoValue: '1183',
        ocupacionOp: 'Banquero',
        ocupacionValue: '1048',
        salario: '3687',
        descripcionOtrosIngresos: 'Ingresos varios',
        montoOtrosIngresos: '120',
        estadoCivilOp: 'Casado(a)',
        estadoCivilValue: 'MARRIED',
    }
};
var planilla = [Data_generica, casepep]
/*LOGUIN(loguin)
PROD_TEMPLATES(Tem_Productos)
KOPEP(casepep)
OCR(ocr)
*/APPTIVIDAD(apptividad)
//PLANILLA(planilla)
