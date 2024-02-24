import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Datetime } from "aws-sdk/clients/costoptimizationhub";
import AWS from "aws-sdk";
import axios from "axios";

async function getStoredBookById(id: string): Promise<Book | null> {
  const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
  const tablename = process.env.PEOPLE_TABLE || ("books-table-dev" as string);

  const params = {
    TableName: tablename,
    Key: {
      bookId: id,
    },
  };
  const book = await dynamoDbClient.get(params).promise();
  if (!book.Item) {
    return null;
  }
  return book.Item as Book;
}

export const getData = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | { error: any }> => {
  try {
    const path: string = (event as any).rawPath;
    const pathParameters = event.pathParameters;
    const id = pathParameters?.id;
    let item: any;
    let statusCode: number = 200;
    if (path.includes("/swapi/people/")) {
      const response = await axios.get(
        "https://swapi.py4e.com/api/people/" + id
      );
      if (response?.data) {
        const peopleEn = { ...response.data, peopleId: id } as PeopleEN;
        const peopleDTO = new PeopleDTO(peopleEn);
        item = peopleDTO.exportToPeopleInterface();
      } else {
        statusCode = 404;
        item = { message: "No response data from swapi" };
      }
    } else if (path.includes("/books/")) {
      const storedBook = await getStoredBookById(id as string);
      item = storedBook;
    } else {
      statusCode = 404;
      item = { message: "Unknown path" };
    }
    return {
      statusCode,
      body: JSON.stringify(item),
    };
  } catch (error) {
    return { error };
  }
};

interface Book {
  bookId: string;
  title: string;
  author: string;
  publicationYear: number;
  genre: string;
  pageCount: number;
  createdAt: Datetime;
}

class PeopleDTO {
  peopleId: string;
  nombre: string;
  altura: string;
  masa: string;
  color_pelo: string;
  color_piel: string;
  color_ojos: string;
  ano_nacimiento: string;
  genero: string;
  mundo: string;
  peliculas: string[];
  especies: string[];
  vehiculos: string[];
  naves: string[];
  creado: Datetime;
  editado: Datetime;
  enlace: string;
  constructor(data: PeopleEN) {
    this.peopleId = data.peopleId as string;
    this.nombre = data.name as string;
    this.altura = data.height as string;
    this.masa = data.mass as string;
    this.color_pelo = data.hair_color as string;
    this.color_piel = data.skin_color as string;
    this.color_ojos = data.eye_color as string;
    this.ano_nacimiento = data.birth_year as string;
    this.genero = data.gender as string;
    this.mundo = data.homeworld as string;
    this.peliculas = data.films as string[];
    this.especies = data.species as string[];
    this.creado = data.created as Datetime;
    this.editado = data.edited as Datetime;
    this.vehiculos = data.vehicles as string[];
    this.naves = data.starships as string[];
    this.enlace = data.url as string;
  }
  exportToPeopleInterface(): People {
    const people = this as People;
    return people;
  }
}

interface PeopleEN {
  peopleId: string;
  name?: string;
  height?: string;
  mass?: string;
  hair_color?: string;
  skin_color?: string;
  eye_color?: string;
  birth_year?: string;
  gender?: string;
  homeworld?: string;
  films?: string[];
  species?: string[];
  vehicles?: string[];
  starships?: string[];
  created?: Datetime;
  edited?: Datetime;
  url?: string;
}

interface People {
  peopleId: string;
  nombre: string;
  altura: string;
  masa: string;
  color_pelo: string;
  color_piel: string;
  color_ojos: string;
  ano_nacimiento: string;
  genero: string;
  mundo: string;
  peliculas: string[];
  especies: string[];
  vehiculos: string[];
  naves: string[];
  creado: Datetime;
  editado: Datetime;
  enlace: string;
}
