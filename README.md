# Rare Things front

## Description

This repository contains the frontend files for the Rare Things app which allows registered users to upload images and vote them. The app is generated with [Angular CLI] version 17.0.0. and a responsive HTML template made with [Bootstrap 5.3].
The frontend app interacts with the backend API [Sprint_9_Rare_Things_back](https://github.com/fran-cesc/Sprint_9_Rare_Things_back).

## Tecnologies

- HTML
- CSS
- Typescript
- Angular version 17.0.0
- Bootstrap version 5.3


## Requirements

- Node.js y npm instalados en tu sistema. Puedes descargarlos desde [nodejs.org](https://nodejs.org/).
- Angular CLI instalado globalmente. Puedes instalarlo con el siguiente comando:

```bash
npm install -g @angular/cli
```

## 🛠️ Instalación

**✔️ Paso 1:** Levanta el servidor de base de datos, utilizando XAMPP u otra herramienta similar. Importa la base de datos utilizando el archivo **_ezhub.sql_**.

**✔️ Paso 2:** Levanta el servidor [Ezhub](https://github.com/Yul1b3th/ezhub-backend)

**✔️ Paso 3:** Clona el repositorio:

```bash
git clone https://github.com/Yul1b3th/ezhub-frontend.git
```

**✔️ Paso 4:** Ingresa al directorio del proyecto:

```bash
cd ezhub-frontend
```

**✔️ Paso 5:** Copia el archivo **_.env.template_** y renómbralo como **_.env_**. Este archivo contendrá las variables de entorno necesarias para la configuración del proyecto.

**✔️ Paso 7:** Abre el archivo **_.env_** y completa las variables de entorno según las especificaciones proporcionadas en el archivo. Asegúrate de incluir la clave de acceso de MapBox u otras credenciales sensibles sin compartirlas en repositorios públicos.

**✔️ Paso 7:** Instala las dependencias:

```bash
npm install
```

## ▶️ Ejecución

Ejecuta la aplicación con el siguiente comando:

```bash
npm start
```

## 🌐 Despliegue

Para desplegar la aplicación en producción, sigue estos pasos:

**✔️ Paso 1:** Ejecuta el comando de construcción para compilar la aplicación Angular:

```bash
ng build --prod
```

**✔️ Paso 2:** Los archivos generados se almacenarán en el directorio `dist/`. Puedes desplegar estos archivos en un servidor web o en un servicio de alojamiento que admita aplicaciones web estáticas.

## 🤝 Contribuciones

Si deseas colaborar en este proyecto o informar sobre problemas, no dudes en crear un "issue" o enviar un "pull request."
