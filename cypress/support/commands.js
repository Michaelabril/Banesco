import "cypress-file-upload";

Cypress.Commands.add("Preguntas_Regulatorias", () => {
  // Pantalla de plantilla
  cy.url().then(url => {
    if(url.includes('caracteristicas')){
      cy.wait(10000);
      cy.screenshot("E2E/Condiciones_Producto");
      cy.get("[data-test=quiero-mi-cuenta-btn]").should("be.visible").click();
    
      //Pantalla de preguntas regulatorias
      cy.wait(10000);
      cy.get("[data-test=no-fatca-btn]").click();
      cy.get("[data-test=no-fis]").click();
      cy.get("[data-test=no-pep]").click();
      cy.get("[data-test=no-fampep]").click();
      cy.screenshot("E2E/Preguntas_Regulatorias");
      cy.get("[data-test=fatcapep-btn-siguiente]").click();
      cy.wait("@FatcaPep", { timeout: 60000 }).then((xhr) => {
        expect(xhr.status).to.eq(200);
        expect(xhr.responseBody.HttpResponse.code).to.eq(200);
      });
  }else{
    //Pantalla de preguntas regulatorias
    cy.wait(10000);
    cy.get("[data-test=no-fatca-btn]").click();
    cy.get("[data-test=no-fis]").click();
    cy.get("[data-test=no-pep]").click();
    cy.get("[data-test=no-fampep]").click();
    cy.screenshot("E2E/Preguntas_Regulatorias");
    cy.get("[data-test=fatcapep-btn-siguiente]").click();
    /*cy.wait("@FatcaPep", { timeout: 60000 }).then((xhr) => {
      expect(xhr.status).to.eq(200);
      expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    });*/
  }
  }); 
});

Cypress.Commands.add("Preguntas_Regulatorias_si", () => {
  // Pantalla de plantilla
  cy.wait(10000);
  cy.screenshot("E2E/Condiciones_Producto");
  cy.get("[data-test=quiero-mi-cuenta-btn]").should("be.visible").click();

  //Pantalla de preguntas regulatorias
  cy.wait(10000);
  cy.get("[data-test=si-fatca-btn]").click();
  cy.get("[data-test=si-fis]").click();
  cy.get("[data-test=si-pep]").click();
  cy.get("[data-test=si-fampep]").click();
  cy.screenshot("E2E/Preguntas_Regulatorias_si");
  cy.get("[data-test=fatcapep-btn-siguiente]").click();
  cy.wait("@FatcaPep", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
  });
});

Cypress.Commands.add("Ocr_ce", (data_ocr_ce) => {
  //Pantalla de captura identificacion cedula
  cy.wait(20000);
  cy.screenshot("E2E_CE/Ocr_Cedula");
  cy.get("[data-test=ocr-unificado-siguiente]").click();
  cy.wait("@Ocr", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.OnBoardingOcrData.code).to.eq("OK");
  });

  // Pantalla de Datos generales
  cy.wait(10000);
  cy.get('[data-test="input-fecha-expedicion-cedula"]').clear();
  cy.get('[data-test="input-fecha-vencimiento-cedula"]').clear();
  cy.get('[data-test="input-rif"]').clear();

  cy.get('[data-test="input-fecha-expedicion-cedula"]').type(
    data_ocr_ce.datosUsuario.fechaexpedicion
  );
  cy.get('[data-test="input-fecha-vencimiento-cedula"]').type(
    data_ocr_ce.datosUsuario.fechaVencimiento
  );
  cy.get('[data-test="situacion-laboral-select"]').select("COLOMBIA");
  cy.get('[data-test="input-rif"]').type(data_ocr_ce.datosUsuario.numeroRif);
  cy.screenshot("E2E_CE/Validacion_Datos");
  cy.get("[data-test=generar-contrato-btn]").click();
  cy.wait(1000);
  cy.get('button[id="enviar-correo-correcto"]').click();
  cy.wait("@validatedata", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.OnboardingValidateData.serviceResponse).to.eq(true);
  });
});

Cypress.Commands.add("Ocr_cn", (data_ocr_cn) => {
  //Pantalla de captura identificacion cedula
  cy.wait(20000);
  cy.screenshot("E2E_cn/Ocr");
  cy.get("[data-test=ocr-unificado-siguiente]").click();
  cy.wait("@Ocr", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.OnBoardingOcrData.code).to.eq("OK");
  });

  // Pantalla de Datos generales
  cy.wait(10000);
  cy.get('[data-test="input-primer-nombre"]').clear();
  cy.get('[data-test="input-segundo-nombre"]').clear();
  cy.get('[data-test="input-primer-apellido"]').clear();
  cy.get('[data-test="input-segundo-apellido"]').clear();
  cy.get('[data-test="input-fecha-nacimiento"]').clear();
  cy.get('[data-test="input-fecha-expedicion"]').clear();
  cy.get('[data-test="input-fecha-vencimiento"]').clear();
  cy.get('[data-test="input-rif"]').clear();

  cy.get('[data-test="input-primer-nombre"]').click();
  cy.get('[data-test="input-primer-nombre"]').type(
    data_ocr_cn.datosUsuario.nombres
  );
  cy.get('[data-test="input-segundo-nombre"]').type(
    data_ocr_cn.datosUsuario.nombre2
  );
  cy.get('[data-test="input-primer-apellido"]').type(
    data_ocr_cn.datosUsuario.apellidos
  );
  cy.get('[data-test="input-segundo-apellido"]').type(
    data_ocr_cn.datosUsuario.apellido2
  );
  cy.get('[data-test="input-fecha-nacimiento"]').type(
    data_ocr_cn.datosUsuario.fechaNacimiento
  );
  cy.get('[data-test="input-genero"]').select("Femenino");
  cy.get('[data-test="input-apellido-casada"]').clear();
  cy.get('[data-test="input-apellido-casada"]').type(
    data_ocr_cn.datosUsuario.ApellidoCasada
  );
  cy.get('[data-test="input-fecha-expedicion"]').type(
    data_ocr_cn.datosUsuario.fechaexpedicion
  );
  cy.get('[data-test="input-fecha-vencimiento"]').type(
    data_ocr_cn.datosUsuario.fechaVencimiento
  );
  cy.get('[data-test="situacion-laboral-select"]').select("COLOMBIA");
  cy.get('[data-test="input-rif"]').type(data_ocr_cn.datosUsuario.numeroRif);
  cy.get("[data-test=generar-contrato-btn]").should("have.class", "btnDCLJR");
  cy.screenshot("E2E_cn/Dgenerales");
  cy.get("[data-test=generar-contrato-btn]").click();
  cy.wait(1000);
  cy.get('button[id="enviar-correo-correcto"]').click();
  cy.wait("@validatedata", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.OnboardingValidateData.serviceResponse).to.eq(true);
  });
});

Cypress.Commands.add("Ocr_simplificada", (data_ocr_cn) => {
  //Pantalla de captura identificacion cedula
  cy.wait(20000);
  cy.screenshot("E2E_cn/Ocr");
  cy.get("[data-test=ocr-unificado-siguiente]").click();
  cy.wait("@Ocr", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.OnBoardingOcrData.code).to.eq("OK");
  });

  // Pantalla de Datos generales
  cy.wait(10000);
  cy.get('[data-test="input-fecha-nacimiento-verificacion"]').clear();
  cy.get('[data-test="input-fecha-expedicion-cedula"]').clear();
  cy.get('[data-test="input-fecha-vencimiento-cedula"]').clear();
  cy.get('[data-test="input-rif"]').clear();

  cy.get('[data-test="input-fecha-nacimiento-verificacion"]').click();
  cy.get('[data-test="input-fecha-nacimiento-verificacion"]').type(
    data_ocr_cn.datosUsuario.fechaNacimiento
  );

  cy.get('[data-test="input-genero"]').select("Femenino");

  cy.get('[data-test="input-fecha-expedicion-cedula"]').type(
    data_ocr_cn.datosUsuario.fechaexpedicion
  );
  cy.get('[data-test="input-fecha-vencimiento-cedula"]').type(
    data_ocr_cn.datosUsuario.fechaVencimiento
  );
  cy.get('[data-test="situacion-laboral-select"]').select("COLOMBIA");
  cy.get('[data-test="input-rif"]').type(data_ocr_cn.datosUsuario.numeroRif);

  cy.get("[data-test=generar-contrato-btn]").should("have.class", "btnDCLJR");
  cy.screenshot("E2E_cn/Dgenerales");
  cy.get("[data-test=generar-contrato-btn]").click();
  cy.wait(1000);
  cy.get('button[id="enviar-correo-correcto"]').click();
  cy.wait("@validatedata", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.OnboardingValidateData.serviceResponse).to.eq(true);
  });
});

Cypress.Commands.add("example", () => {
  cy.url().then(url => {
    if(url.includes('caracteristicas')){
  //Ejecuta funcion que debe hacer cuando esta en la pantalla de caracteristicas
  }else{
  //Ejecuta funcion que debe hacer cuando esta en la pantalla de preguntas regulatorias
  }
  });
});

Cypress.Commands.add("Apptividad", () => {
  cy.url().then(url => {
    if(url.includes('autorizacion')){
      cy.wait(10000);
      cy.screenshot("E2E/Apptividad");
      cy.get("[data-test=apptividad-acepto-btn]").click();
      cy.wait("@apptividad", { timeout: 60000 }).then((xhr) => {
        expect(xhr.status).to.eq(200);
        expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        expect(xhr.responseBody.OnboardingApptivityData.code).to.eq("Ok");
        expect(xhr.responseBody.OnboardingApptivityData.serviceResponse).to.eq(true);
      });
  }else{
      cy.wait(10000);
      cy.screenshot("E2E/Apptividad");
      cy.get("[data-test=apptividad-acepto-btn]").click();
      cy.wait("@apptividad_menor", { timeout: 60000 }).then((xhr) => {
        expect(xhr.status).to.eq(200);
        expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        expect(xhr.responseBody.OnboardingApptivityData.code).to.eq("Ok");
        expect(xhr.responseBody.OnboardingApptivityData.serviceResponse).to.eq(true);
      });
  }
});
});

Cypress.Commands.add("Biometria", () => {
  // Biometria
  cy.wait(10000);
  /*cy.get('.titleTutorialCedulaICB')
    .should("have.text", "Tómate una selfie, tal y como lo ves");*/
  cy.get("[data-test=iniciar-captura-unificado]").click({
    timeout: 6000,
  });
  cy.wait(9000);
  cy.screenshot("E2E/Biometria");
  cy.get("[data-test=siguiente-biometria-unificado]").click();
  cy.wait("@biometria", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.OnBoardingBiometricData.code).to.eq("Ok");
    expect(xhr.responseBody.OnBoardingBiometricData.serviceResponse).to.eq(
      true
    );
  });
});

Cypress.Commands.add("InicioMenor", (dataMenor) => {
  cy.wait(10000);
  cy.screenshot("E2E_cn/MenorEdad");
  cy.get('[data-test="btn-continue"]').should("be.visible").click();
  cy.wait(8000);
  cy.get('[data-test="input-primer-nombre"]')
    .should("be.visible")
    .type(dataMenor.ValidateDataMenor.PrimerNombreMenor);
  cy.get('[data-test="input-segundo-nombre"]')
    .should("be.visible")
    .type(dataMenor.ValidateDataMenor.SegundoNombreMenor);
  cy.get('[data-test="input-primer-apellido"]')
    .should("be.visible")
    .type(dataMenor.ValidateDataMenor.PrimerApellidoMenor);
  cy.get('[data-test="input-segundo-apellido"]')
    .should("be.visible")
    .type(dataMenor.ValidateDataMenor.SegundoApellidoMenor);
  cy.get('[data-test="input-fecha-nacimiento"]')
    .should("be.visible")
    .type(dataMenor.ValidateDataMenor.FechaNacimientoMenor);
  cy.get('[data-test="input-genero"]')
    .should("be.visible")
    .select(dataMenor.ValidateDataMenor.GeneroMenor);
  cy.get(':nth-child(7) > [data-test="input-nacionalidad"]')
    .should("be.visible")
    .select(dataMenor.ValidateDataMenor.NacionalidadMenor);
  cy.get('[data-test="input-numero-pasaporte"]')
    .should("be.visible")
    .type(dataMenor.ValidateDataMenor.PasaporteMenor);
  cy.get(':nth-child(9) > [data-test="input-nacionalidad"]')
    .should("be.visible")
    .select(dataMenor.ValidateDataMenor.PaisDocumentoMenor);
  cy.get('[data-test="input-cedula"]')
    .should("be.visible")
    .type(dataMenor.ValidateDataMenor.CedulaMenor);
  cy.get('[data-test="input-fecha-expedicion"]')
    .should("be.visible")
    .type(dataMenor.ValidateDataMenor.FechaExpedicionMenor);
  cy.get('[data-test="input-fecha-vencimiento"]')
    .should("be.visible")
    .type(dataMenor.ValidateDataMenor.FechaVencimientoMenor);
  cy.get('[data-test="situacion-laboral-select"]')
    .should("be.visible")
    .type(dataMenor.ValidateDataMenor.PaisNacimientoMenor);
  cy.screenshot("E2E_cn/ValidateDataMenor");
  cy.get('[data-test="generar-contrato-btn"]').should("be.visible").click();
  cy.get('[data-test="es-correcto-email"]').should("be.visible").click();
});

Cypress.Commands.add("Direccion_cn", (data_direccion_cn) => {
  cy.wait(10000);
  cy.get('p[class="subtitleTuDireccion"]').should(
    "have.text",
    " Ahora necesitamos tu teléfono celular y tus datos residenciales: "
  );
  cy.get("[data-test=country]").should("be.visible").select("VENEZUELA");
  cy.get("[data-test=distrito-select]").should("be.visible").select("MIRANDA");
  cy.get("[data-test=corregimiento-select]")
    .should("be.visible")
    .select("NUESTRA SENORA DEL ROSARIO DE BARUT");
  cy.get("[data-test=barriada-input]")
    .should("be.visible")
    .type(data_direccion_cn.direccion.urbanizacion);
  cy.get("[data-test=Calle-input]")
    .should("be.visible")
    .type(data_direccion_cn.direccion.calle);
  cy.get(":nth-child(1) > [data-test=casa-apartamento]")
    .should("be.visible")
    .type(data_direccion_cn.direccion.edificio);
  cy.get(":nth-child(2) > [data-test=casa-apartamento]")
    .should("be.visible")
    .type(data_direccion_cn.direccion.casa);
  cy.get(":nth-child(5) > :nth-child(1) > [data-test=cellphone-input]")
    .should("be.visible")
    .type(data_direccion_cn.direccion.telefonoResidencial);
  cy.get(".col-md-6.ng-star-inserted > [data-test=cellphone-input]")
    .should("be.visible")
    .type(data_direccion_cn.direccion.telefonoCelular);
  cy.get(".col-md-12 > [data-test=cellphone-input]")
    .should("be.visible")
    .type(data_direccion_cn.direccion.puntoReferencia);
  cy.screenshot("E2E_cn/Direccion");
  cy.get("[data-test=siguiente-direccion-btn]").should("be.visible").click();
  cy.wait("@guardarDireccion", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.OnboardingSaveAddressData.serviceResponse).to.eq(
      true
    );
  });
});

Cypress.Commands.add("Direccion", (data_direccion_ce) => {
  cy.wait(10000);
  cy.get('p[class="subtitleTuDireccion"]').should(
    "have.text",
    " Ahora necesitamos tu teléfono celular y tus datos residenciales: "
  );
  //cy.get("[data-test=country]").should("be.visible").select("VENEZUELA");
  cy.get("[data-test=distrito-select]").should("be.visible").select("MIRANDA");
  cy.get("[data-test=corregimiento-select]")
    .should("be.visible")
    .select("NUESTRA SENORA DEL ROSARIO DE BARUT");
  cy.get("[data-test=barriada-input]")
    .should("be.visible")
    .type(data_direccion_ce.direccion.urbanizacion);
  cy.get("[data-test=Calle-input]")
    .should("be.visible")
    .type(data_direccion_ce.direccion.calle);
  cy.get(":nth-child(1) > [data-test=casa-apartamento]")
    .should("be.visible")
    .type(data_direccion_ce.direccion.edificio);
  cy.get(":nth-child(2) > [data-test=casa-apartamento]")
    .should("be.visible")
    .type(data_direccion_ce.direccion.casa);
  cy.get(":nth-child(5) > :nth-child(1) > [data-test=cellphone-input]")
    .should("be.visible")
    .type(data_direccion_ce.direccion.telefonoResidencial);
  /*cy.get(".col-md-6.ng-star-inserted > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2eCE.direccion.telefonoCelular);*/
  cy.get(".col-md-12 > [data-test=cellphone-input]")
    .should("be.visible")
    .type(data_direccion_ce.direccion.puntoReferencia);
  cy.screenshot("E2E_CE/Direccion");
  cy.get("[data-test=siguiente-direccion-btn]").should("be.visible").click();
  cy.wait("@guardarDireccion", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.OnboardingSaveAddressData.serviceResponse).to.eq(
      true
    );
  });
});

Cypress.Commands.add("Direccion_cm", (data_direccion_cn) => {
  cy.wait(10000);
  cy.get('[data-test="input-email-test"]').should("be.visible").type("mabril@hypernovalabs.com");
  cy.get("[data-test=country]").should("be.visible").select("VENEZUELA");
  cy.get("[data-test=distrito-select]").should("be.visible").select("MIRANDA");
  cy.get("[data-test=corregimiento-select]")
    .should("be.visible")
    .select("NUESTRA SENORA DEL ROSARIO DE BARUT");
  cy.get("[data-test=barriada-input]")
    .should("be.visible")
    .type(data_direccion_cn.direccion.urbanizacion);
  cy.get("[data-test=Calle-input]")
    .should("be.visible")
    .type(data_direccion_cn.direccion.calle);
  cy.get(":nth-child(1) > [data-test=casa-apartamento]")
    .should("be.visible")
    .type(data_direccion_cn.direccion.edificio);
  cy.get(":nth-child(2) > [data-test=casa-apartamento]")
    .should("be.visible")
    .type(data_direccion_cn.direccion.casa);
  cy.get(':nth-child(6) > :nth-child(1) > [data-test="cellphone-input"]')
    .should("be.visible")
    .type(data_direccion_cn.direccion.telefonoResidencial);
  cy.get(':nth-child(2) > [data-test="cellphone-input"]')
    .should("be.visible")
    .type(data_direccion_cn.direccion.telefonoCelular);
  cy.get('.col-md-12 > [data-test="cellphone-input"]')
    .should("be.visible")
    .type(data_direccion_cn.direccion.puntoReferencia);
  cy.screenshot("E2E_cn/Direccion");
  cy.get("[data-test=siguiente-direccion-btn]").should("be.visible").click();
});

Cypress.Commands.add("TDD", () => {
  //TDD
  cy.wait(10000);
  cy.wait("@seguro", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(
      xhr.responseBody.OnboardingConsultInsuranceData.Data[0].insurance_code
    ).to.eq("03");
    expect(
      xhr.responseBody.OnboardingConsultInsuranceData.Data[0]
        .insurance_description
    ).to.eq("PROGRAMA CONTRA ROBO/FRAUDE 10,000.00");
    expect(
      xhr.responseBody.OnboardingConsultInsuranceData.Data[1].insurance_code
    ).to.eq("06");
    expect(
      xhr.responseBody.OnboardingConsultInsuranceData.Data[1]
        .insurance_description
    ).to.eq("PROGRAMA CONTRA ROBO/FRAUDE 5,000.00");
    expect(
      xhr.responseBody.OnboardingConsultInsuranceData.ServiceResponse
    ).to.eq(true);
  });
  cy.wait("@tdd", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    /*expect(
      xhr.responseBody.OnboardingConsultTddData.Data[0].card_code_emi
    ).to.eq("05");
    expect(xhr.responseBody.OnboardingConsultTddData.Data[0].card_name).to.eq(
      "DEBITO MASTERCARD STANDARD (CLASICA) INTERNACIONAL"
    );
    expect(
      xhr.responseBody.OnboardingConsultTddData.Data[1].card_code_emi
    ).to.eq("03");
    expect(xhr.responseBody.OnboardingConsultTddData.Data[1].card_name).to.eq(
      "PLATINUM DEBITO BANCA INTERNACIONAL"
    );*/
  });
  cy.screenshot("E2E/Pantalla_Tdd");
  cy.get("[data-test=btn-quiero-tarjeta]").should("be.visible").click();
});

Cypress.Commands.add("TDD_Simplificada", () => {
  //TDD
  cy.wait(10000);
  cy.screenshot("E2E/Pantalla_Tdd");
  cy.get("[data-test=btn-quiero-tarjeta]").should("be.visible").click();
});

Cypress.Commands.add("Declaracion_Jurada", (data_declaracionJurada) => {
  cy.wait(10000);
  cy.wait("@negocios", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.OnboardingTypeOfBusinessMessage.code).to.eq(200);
    expect(xhr.responseBody.OnboardingTypeOfBusinessMessage.message).to.eq(
      "Ok"
    );
  });
  cy.wait("@profesion", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.OnboardingProfessionMessage.code).to.eq(200);
    expect(xhr.responseBody.OnboardingProfessionMessage.message).to.eq("Ok");
  });
  cy.wait("@empleados", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.OnboardingEmploymentSituationMessage.code).to.eq(
      200
    );
    expect(xhr.responseBody.OnboardingEmploymentSituationMessage.message).to.eq(
      "Ok"
    );
  });
  cy.wait("@estadoCivil", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.OnboardingCivilStatusMessage.code).to.eq(200);
    expect(xhr.responseBody.OnboardingCivilStatusMessage.message).to.eq("Ok");
  });
  cy.wait("@paisestransferencia", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
  });
  cy.wait("@empleados", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(
      xhr.responseBody.OnboardingConsultInsuranceData.ServiceResponse
    ).to.eq(true);
  });
  cy.wait("@perfiltransaccional", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
  });
  // Pantalla de DECLARACION JURADA
  cy.wait(10000);
  cy.get("[data-test=situacion-laboral-select]")
    .should("be.visible")
    .select("ASALARIADO");
  cy.get("[data-test=tipo-negocio-select]")
    .should("be.visible")
    .select("ADMINISTRACION");
  cy.get("[data-test=ocupacion-select]")
    .should("be.visible")
    .select("ADMINISTRADOR");
  cy.get("[data-test=salario-input]")
    .should("be.visible")
    .type(data_declaracionJurada.declaracion.salario);
  cy.get("[data-test=text-otros-ingresos]")
    .should("be.visible")
    .type(data_declaracionJurada.declaracion.descripcionOtrosIngresos);
  cy.get("[data-test=monto-otros-ingresos]")
    .should("be.visible")
    .type(data_declaracionJurada.declaracion.montoOtrosIngresos);
  cy.get("[data-test=monto_apertura-input]")
    .should("be.visible")
    .type(data_declaracionJurada.declaracion.montoApertura);
  cy.get("[data-test=origen_fondos-select]")
    .should("be.visible")
    .select("FONDOS PROPIOS");
  cy.get("[data-test=estado-civil-select]")
    .should("be.visible")
    .select("SOLTERO(A)");
  cy.get("[data-test=perfil_transaccional-select]")
    .should("be.visible")
    .select("PREFIERO HACER MOVIMIENTOS LOCALES E INTERNACIONALES");
  cy.screenshot("E2E/D_Jurada");
  cy.get("[data-test=generar-contrato-btn]").should("be.visible").click();
  cy.wait("@actualizarprospect", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
    expect(xhr.responseBody.OnboardingProspectData.isRisk).to.eq(false);
    expect(xhr.responseBody.OnboardingProspectData.prospectSave).to.eq(true);
    expect(xhr.responseBody.OnboardingProspectData.serviceResponse).to.eq(true);
  });
});

Cypress.Commands.add("Declaracion_Jurada_menor", (data_declaracionJurada) => {
  // Pantalla de DECLARACION JURADA
  cy.wait(10000);
  cy.get("[data-test=situacion-laboral-select]")
    .should("be.visible")
    .select("DEPENDIENTE");
  cy.get("[data-test=tipo-negocio-select]")
    .should("be.visible")
    .select("MENOR DE EDAD");
  cy.get("[data-test=ocupacion-select]")
    .should("be.visible")
    .select("ESTUDIANTE");
  cy.get("[data-test=salario-input]")
    .should("be.visible")
    .type(data_declaracionJurada.declaracion.salario);
  cy.get("[data-test=text-otros-ingresos]")
    .should("be.visible")
    .type(data_declaracionJurada.declaracion.descripcionOtrosIngresos);
  cy.get("[data-test=monto-otros-ingresos]")
    .should("be.visible")
    .type(data_declaracionJurada.declaracion.montoOtrosIngresos);
  cy.get("[data-test=monto_apertura-input]")
    .should("be.visible")
    .type(data_declaracionJurada.declaracion.montoApertura);
  cy.get("[data-test=origen_fondos-select]")
    .should("be.visible")
    .select("FONDOS PROPIOS");
  cy.get("[data-test=estado-civil-select]")
    .should("be.visible")
    .select("SOLTERO(A)");
  cy.get("[data-test=perfil_transaccional-select]")
    .should("be.visible")
    .select("PREFIERO HACER MOVIMIENTOS LOCALES E INTERNACIONALES");
  cy.screenshot("E2E/D_Jurada");
  cy.get("[data-test=generar-contrato-btn]").should("be.visible").click();
  /*cy.wait("@actualizarprospect", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
    expect(xhr.responseBody.OnboardingProspectData.isRisk).to.eq(false);
    expect(xhr.responseBody.OnboardingProspectData.prospectSave).to.eq(true);
    expect(xhr.responseBody.OnboardingProspectData.serviceResponse).to.eq(true);
  });*/
});

Cypress.Commands.add("Declaracion_Jurada_simplificada",(data_declaracionJurada) => {
    cy.wait("@negocios", { timeout: 60000 }).then((xhr) => {
      expect(xhr.status).to.eq(200);
      expect(xhr.responseBody.HttpResponse.code).to.eq(200);
      expect(xhr.responseBody.OnboardingTypeOfBusinessMessage.code).to.eq(200);
      expect(xhr.responseBody.OnboardingTypeOfBusinessMessage.message).to.eq(
        "Ok"
      );
    });
    cy.wait("@profesion", { timeout: 60000 }).then((xhr) => {
      expect(xhr.status).to.eq(200);
      expect(xhr.responseBody.HttpResponse.code).to.eq(200);
      expect(xhr.responseBody.OnboardingProfessionMessage.code).to.eq(200);
      expect(xhr.responseBody.OnboardingProfessionMessage.message).to.eq("Ok");
    });
    cy.wait("@empleados", { timeout: 60000 }).then((xhr) => {
      expect(xhr.status).to.eq(200);
      expect(xhr.responseBody.HttpResponse.code).to.eq(200);
      expect(xhr.responseBody.OnboardingEmploymentSituationMessage.code).to.eq(
        200
      );
      expect(
        xhr.responseBody.OnboardingEmploymentSituationMessage.message
      ).to.eq("Ok");
    });
    cy.wait("@estadoCivil", { timeout: 60000 }).then((xhr) => {
      expect(xhr.status).to.eq(200);
      expect(xhr.responseBody.HttpResponse.code).to.eq(200);
      expect(xhr.responseBody.OnboardingCivilStatusMessage.code).to.eq(200);
      expect(xhr.responseBody.OnboardingCivilStatusMessage.message).to.eq("Ok");
    });

    // DECLARACION JURADA
    cy.wait(10000);
    cy.get("[data-test=situacion-laboral-select]")
      .should("be.visible")
      .select("ASALARIADO");
    cy.get("[data-test=tipo-negocio-select]")
      .should("be.visible")
      .select("ADMINISTRACION");
    cy.get("[data-test=ocupacion-select]")
      .should("be.visible")
      .select("ADMINISTRADOR");
    cy.get("[data-test=salario-input]")
      .should("be.visible")
      .type(data_declaracionJurada.declaracion.salario);
    cy.get("[data-test=estado-civil-select]")
      .should("be.visible")
      .select("SOLTERO(A)");
    cy.get("[data-test=generar-contrato-btn]").should("be.visible").click();

    // CONTRACTO
    cy.wait("@actualizarprospectsimpli", { timeout: 60000 }).then((xhr) => {
      expect(xhr.status).to.eq(200);
      expect(xhr.responseBody.HttpResponse.code).to.eq(200);
      expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
      expect(xhr.responseBody.OnboardingProspectData.isRisk).to.eq(false);
      expect(xhr.responseBody.OnboardingProspectData.prospectSave).to.eq(true);
      expect(xhr.responseBody.OnboardingProspectData.serviceResponse).to.eq(
        true
      );
    });
    cy.wait("@mostrarContractosimpl", { timeout: 60000 }).then((xhr) => {
      expect(xhr.status).to.eq(200);
      expect(xhr.responseBody.HttpResponse.code).to.eq(200);
      expect(xhr.responseBody.HttpResponse.message).to.eq("Ok.");
    });
    cy.wait(10000);
    cy.get(".p-2 > #CONDICIONESDETUCUENTA").should("be.visible").click();
    cy.wait(10000);
    cy.get("[data-test=acepto-contrato]").click();
    cy.wait("@aceptarContracto", { timeout: 60000 }).then((xhr) => {
      expect(xhr.status).to.eq(200);
      expect(xhr.responseBody.HttpResponse.code).to.eq(200);
      expect(xhr.responseBody.OnboardingConfirmData.serviceResponse).to.eq(
        true
      );
    });
    cy.wait(150000);
    cy.screenshot("BENEFICIARIOS/contracto.png");
  }
);

Cypress.Commands.add("Carga_documentos", () => {
  //Carga de documentos
  cy.wait(10000);
  cy.get(".col-lg-9 > .container-fluid > :nth-child(1)").contains(
    "Antes de continuar, necesito que nos proporciones los siguientes datos que completarán la prueba de tus ingresos"
  );
  const CTRABAJO = "ctrabajo.pdf";
  const DRENTA = "drenta.pdf";
  const EFINANCIERO = "efinanciero.pdf";
  const CINGRESOS = "cingresos2.jpg";
  const FIRMA = "firma.jpg";
  cy.get("#file").attachFile(CTRABAJO);
  cy.get("#file").attachFile(DRENTA);
  cy.get("#file").attachFile(EFINANCIERO);
  cy.get("#file").attachFile(CINGRESOS);
  cy.get("#file2").attachFile(FIRMA);
  cy.screenshot("E2E/C_documentos_DJ");
  cy.get('[data-test="generar-contrato-btn"]').should("be.visible").click();
  cy.wait("@guardarimagenes", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.HttpResponse.message).to.eq("OK");
    expect(xhr.responseBody.OnboardingGetImagesData.serviceResponse).to.eq(
      true
    );
  });
});

Cypress.Commands.add("Carga_documentos_menor", () => {
  //Carga de documentos
  cy.wait(10000);
  cy.get('.container > :nth-child(1)').contains(
    "Antes de continuar, necesitamos que el tutor del menor nos proporciones 1 de los siguientes documentos que completarán la solicitud."
  );
  const CTRABAJO = "ctrabajo.pdf";
  const DRENTA = "drenta.pdf";
  const EFINANCIERO = "efinanciero.pdf";
  const CINGRESOS = "cingresos2.jpg";
  const FIRMA = "firma.jpg";
  cy.get("#file3").attachFile(CTRABAJO);
  cy.get("#file3").attachFile(DRENTA);
  cy.get("#file").attachFile(EFINANCIERO);
  cy.get("#file").attachFile(CINGRESOS);
  cy.get("#file2").attachFile(FIRMA);
  cy.screenshot("E2E/C_documentos_DJ");
  cy.get('[data-test="generar-contrato-btn"]').should("be.visible").click();
  cy.wait("@guardarImagenesMenor", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.HttpResponse.message).to.eq("OK");
    expect(xhr.responseBody.OnboardingGetImagesData.serviceResponse).to.eq(
      true
    );
  });
  cy.wait("@mostrarContractoMenor", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.HttpResponse.message).to.eq("Ok.");
  });
  cy.wait(10000);
  cy.screenshot("E2E/C_M_solicitud_menor");
  cy.get('[data-test="acepto-contrato"]').should("be.visible").click();
  cy.wait(10000);
  cy.screenshot("E2E/C_M_pantalla_finalizado");
});

Cypress.Commands.add("Beneficiarios", (data_beneficiarios) => {
  //Beneficiarios
  cy.wait(10000);
  cy.get(".pb-0").contains(
    "Queremos resguardar tus intereses. En caso de que te ausentes, coméntanos a quién dejarías estos fondos "
  );
  cy.wait("@beneficiariosPaises", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
    expect(xhr.responseBody.OnboardingProvinceMessage.code).to.eq(200);
    expect(xhr.responseBody.OnboardingProvinceMessage.message).to.eq("Ok");
  });
  cy.wait("@relacionBeneficiarios", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(
      xhr.responseBody.OnboardingFilterRelationshipData.ServiceResponse
    ).to.eq(true);
  });

  cy.get('[data-test="btn-agregar-beneficiario"]').should("be.visible").click();
  cy.get('[data-test="input-ben-primer-nombre"]')
    .should("be.visible")
    .type(data_beneficiarios.beneficiariosData.Bnombres, "{enter}");
  cy.get('[data-test="input-ben-primer-apellido"]')
    .should("be.visible")
    .type(data_beneficiarios.beneficiariosData.Bapellidos);
  cy.get('[data-test="input-ben-fecha-nacimiento"]').type(
    data_beneficiarios.beneficiariosData.BfechaNacimiento
  );
  cy.get('[data-test="input-ben-nacionalidad"]')
    .should("be.visible")
    .select("CO");
  cy.get('[data-test="input-ben-parentesco"]')
    .should("be.visible")
    .select("MADRE");
  cy.get('[data-test="input-ben-porcentaje"]').should("be.visible").type("100");
  cy.get('[data-test="input-ben-identificacion"]')
    .should("be.visible")
    .type(data_beneficiarios.beneficiariosData.Bidentificacion);
  cy.get('[data-test="input-ben-telefono"]')
    .should("be.visible")
    .type(data_beneficiarios.beneficiariosData.Btelefono);
  cy.get('[data-test="input-ben-correo"]')
    .should("be.visible")
    .type(data_beneficiarios.beneficiariosData.Bemail);
  cy.screenshot("E2E/Beneficiarios");
  cy.get('[data-test="btn-guardar-beneficiario"]').should("be.visible").click();
  cy.wait(3000);
  cy.get('[data-test="btn-entregar-beneficiarios"]')
    .should("be.visible")
    .click();
  cy.wait(1000);
  cy.wait("@guardarBeneficiarios", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.OnboardingBeneficiariesData.serviceResponse).to.eq(
      true
    );
  });
  cy.wait("@mostrarContracto", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.HttpResponse.message).to.eq("Ok.");
  });
  cy.wait(10000);
  cy.screenshot("E2E/Contrato");
  cy.get('[data-test="acepto-contrato"]').click();
  cy.wait("@aceptarContracto", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(xhr.responseBody.OnboardingConfirmData.serviceResponse).to.eq(true);
  });
  cy.wait("@registrarpendiente", { timeout: 60000 }).then((xhr) => {
    expect(xhr.status).to.eq(200);
    expect(xhr.responseBody.HttpResponse.code).to.eq(200);
    expect(
      xhr.responseBody.OnboardingRegisterPendingData.serviceResponse
    ).to.eq(true);
  });
  cy.screenshot("E2E/Pan_finalizado");
});

Cypress.Commands.add("FATCA", () => {
  cy.wait(10000);
  const form_W9 = "w9_form.pdf";
  cy.get('[data-test="input-carga-documento"]').attachFile(form_W9);
  cy.wait(1000);
  cy.screenshot("E2E/Fatca");
  cy.get('[data-test="fatcapep-btn-siguiente"]').click();
  cy.wait(20000);
});

Cypress.Commands.add("CRS", () => {
  cy.wait(10000);
  cy.get('[data-test="pais_domicilio_fiscal-select"]')
    .should("be.visible")
    .select("COLOMBIA");
  cy.get('[data-test="numero_contribuyente-input"]')
    .should("be.visible")
    .type("PRUEBA00000");
  cy.screenshot("E2E/Crs");
  cy.get('[data-test="generar-contrato-btn"]').should("be.visible").click();
  cy.wait(10000);
});

Cypress.Commands.add("PEP", () => {
  cy.get('[data-test="button-cargo-pep"]')
    .should("be.visible")
    .type("Militar de las fuerzas armadas");
  cy.get('[data-test="button-fecha-pep"]')
    .should("be.visible")
    .type("1999-12-31");
  cy.get('[data-test="button-organismo-pep"]')
    .should("be.visible")
    .type("CONGRESO MILITAR DE COLOMBIA");
  cy.screenshot("E2E/Pep");
  cy.get('[data-test="quiero-mi-cuenta-btn"]').should("be.visible").click();
});

Cypress.Commands.add("FAMPEP", () => {
  cy.get('[data-test="input-nombre-fampep"]')
    .should("be.visible")
    .type("Andres Duran Navarro");
  cy.get(":nth-child(2) > .form-control")
    .should("be.visible")
    .select("COLOMBIA");
  cy.get('[data-test="input-cargo-fampep"]')
    .should("be.visible")
    .type("MINISTRO DE DEFENSA");
  cy.get('[data-test="input-fecha-fampep"]')
    .should("be.visible")
    .type("2020-12-31");
  cy.screenshot("E2E/Fampep");
  cy.get('[data-test="quiero-mi-cuenta-btn"]').click();
});
