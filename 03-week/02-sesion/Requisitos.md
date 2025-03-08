Sistema de Gestión de Notas
Requisitos Funcionales (RF)
RF1: Registro de Personas

Descripción: El sistema debe permitir el ingreso de información de las personas que interactúan con la plataforma de gestión de notas.
Datos de entrada: Tipo de documento, número de documento, nombre, correo electrónico, dirección y teléfono.
Precondiciones:
El usuario que realiza el registro debe contar con credenciales y autorización.
No se permite la duplicación de números de documento; cada persona puede registrarse solo una vez.
Flujo Normal:
Un usuario autorizado accede al módulo de "Registro de Persona".
Completa los siguientes campos:
Obligatorios: Tipo de documento, número de documento, nombre y correo electrónico.
Opcionales: Dirección y teléfono.
RF2: Registro de Estudiantes

Dependencia: RF1 (El estudiante debe estar registrado como persona previamente).
RF3: Registro de Profesores

Dependencia: RF1 (El profesor debe estar registrado como persona previamente).