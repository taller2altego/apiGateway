# API Gateway Fiuber
### Construido con:

[![Node][Node.js]][Node-url]
[![Express][Express.js]][Express-url]

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/en/
[Express.js]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[Express-url]: https://expressjs.com/es/


## Dependencias

Utilizamos [npm](https://www.npmjs.com/) como gestor de paquetes, y [Docker](https://www.docker.com/) para el despliegue local.



## Instalacion:

Clonar el repositorio e instalar paquetes:

    $ git clone git@github.com:taller2altego/apiGateway.git
    $ npm install

Levantar el API Gateway con Docker local:

    $ npm run docker-up

Para instalar el linter:

    $ npm run prepare

## Test

Se pueden correr los test con:

    $ npm run coverage

## Linter
El linter utilizado es [ESlint](https://eslint.org/).

Para correr el linter:

    $ npm run lint

Para solucionar errores automaticos:

    $ npm run lint:fix

## Deploy app a Heroku

El deploy es manual, se debe instalar la CLI de Heroku, logearse en ella y configurar el remote

    $ heroku git:remote -a altego-fiuber-apigateway

Para deployar:

    $ git push heroku master

Y para ver los ultimos logs:

    $ heroku logs --tail

## Servicios accedidos mediante este ApiGateway


### [User microservice](https://github.com/taller2altego/user-microservice)


### [Identity microservice](https://github.com/taller2altego/identity-service)

### [Travel microservice](https://github.com/taller2altego/travel-microservice)

### [Payments microservice](https://github.com/taller2altego/payments)

### [Metrics microservice](https://github.com/taller2altego/alarms-microservice)




