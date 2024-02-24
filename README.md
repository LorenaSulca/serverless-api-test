# serverless-api-test

## Requisitos

### Clonar el repositorio

```
$ git clone https://github.com/LorenaSulca/serverless-api-test.git
```

Despues de clonar el repositorio, cambiar de directorio a la carpeta del proyecto:

```
$ cd serverless-api-test
```

### Instalar las dependencias del proyecto

```
  $ npm install
```

### Iniciar sesión en AWS

```
$ aws configure
```

### Desplegar el proyecto

```
$ serverless deploy
```
Luego de desplegar el proyecto veras las rutas de acceso a las funciones, DEPLOY_URL es reemplazado por la url del despliegue:

```
Deploying serverless-swapi to stage dev (us-east-2)

✔ Service deployed to stack serverless-swapi-dev (45s)

endpoints:
  POST - DEPLOY_URL/books
  GET - DEPLOY_URL/books
  GET - DEPLOY_URL/swapi/people/{id}
  GET - DEPLOY_URL/books/{id}
  DELETE - DEPLOY_URL/books/{id}
functions:
  storeBook: serverless-swapi-dev-storeBook (5.7 kB)
  getAllBooks: serverless-swapi-dev-getAllBooks (2.1 kB)
  getData: serverless-swapi-dev-getData (77 kB)
  deleteBookById: serverless-swapi-dev-deleteBookById (2.1 kB)
```
## Tests de la API

Ejecutar el siguiente comando
```
$ npm run test
```
## Probar la API
Se puede probar la API con herramientas como Postman.
### Guardar un objeto libro
- Metodo: POST /books
- Body: {
  "title": "string",
  "author": "string",
  "genre": "string",
  "publicationYear": "number",
  "pageCount": "number"
}

Ejemplo de respuesta:
```
{
  "data": {
    "storedBook": {
      "title": "string",
      "author": "string",
      "genre": "string",
      "publicationYear": 0,
      "pageCount": 0
    }
  },
  "message": "Book saved successfully"
}
```

### Obtener todos los objetos libro guardados
- Metodo: GET /books

Ejemplo de respuesta:
```
{
  "items": [
    {
      "bookId": "string",
      "title": "string",
      "author": "string",
      "publicationYear": 0,
      "genre": "string",
      "pageCount": 0,
      "createdAt": "2024-02-24T06:15:37.345Z"
    }
  ]
}

```

### Obtener un libro guardado por Id
- Metodo: GET /books/{id}

Ejemplo de respuesta:
```
{
  "item": {
    "bookId": "string",
    "title": "string",
    "author": "string",
    "publicationYear": 0,
    "genre": "string",
    "pageCount": 0,
    "createdAt": "2024-02-24T06:35:37.030Z"
  }
}

```

### Eliminar un libro guardado por Id
- Metodo: DELETE /books/{id}

Ejemplo de respuesta:
```
{
  "message": "Book deleted successfully"
}

```

### Obtener un objeto people de la swapi API
- Metodo: GET /swapi/people/{id}

Ejemplo de respuesta:
```
{
  "item": {
    "peopleId": "string",
    "nombre": "string",
    "altura": "string",
    "masa": "string",
    "color_pelo": "string",
    "color_piel": "string",
    "color_ojos": "string",
    "ano_nacimiento": "string",
    "genero": "string",
    "mundo": "string",
    "peliculas": [
      "string"
    ],
    "especies": [
      "string"
    ],
    "vehiculos": [
      "string"
    ],
    "naves": [
      "string"
    ],
    "creado": "2024-02-24T06:39:06.414Z",
    "editado": "2024-02-24T06:39:06.414Z",
    "enlace": "string"
  }
}
```