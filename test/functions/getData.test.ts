import { APIGatewayProxyEvent } from "aws-lambda";
import { getData } from "./../../src/functions/getData/getData";
import AWSMock from "aws-sdk";
import axios from "axios";

jest.mock("aws-sdk"); // Mock the entire AWS SDK
jest.mock("axios"); // Mock Axios

describe("getData", () => {
  beforeEach(() => {
    (AWSMock.DynamoDB.DocumentClient.prototype.get as jest.Mock).mockClear(); // Clear mock calls before each test
    (axios.get as jest.Mock).mockClear(); // Clear Axios mock calls before each test
  });

  it("should return data from SWAPI when path is /swapi/people/{id}", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      rawPath: "/swapi/people/1", // Mock the path
      pathParameters: { id: "1" }, // Mock the path parameters
    } as unknown as APIGatewayProxyEvent;
    const mockAxiosResponseData = {
      name: "Luke Skywalker",
      height: "172",
      mass: "77",
      hair_color: "blond",
      skin_color: "fair",
      eye_color: "blue",
      birth_year: "19BBY",
      gender: "male",
      homeworld: "https://swapi.py4e.com/api/planets/1/",
      films: [
        "https://swapi.py4e.com/api/films/1/",
        "https://swapi.py4e.com/api/films/2/",
        "https://swapi.py4e.com/api/films/3/",
        "https://swapi.py4e.com/api/films/6/",
        "https://swapi.py4e.com/api/films/7/",
      ],
      species: ["https://swapi.py4e.com/api/species/1/"],
      vehicles: [
        "https://swapi.py4e.com/api/vehicles/14/",
        "https://swapi.py4e.com/api/vehicles/30/",
      ],
      starships: [
        "https://swapi.py4e.com/api/starships/12/",
        "https://swapi.py4e.com/api/starships/22/",
      ],
      created: "2014-12-09T13:50:51.644000Z",
      edited: "2014-12-20T21:17:56.891000Z",
      url: "https://swapi.py4e.com/api/people/1/",
    };
    const mockResponseData = {
      peopleId: "1",
      nombre: "Luke Skywalker",
      altura: "172",
      masa: "77",
      color_pelo: "blond",
      color_piel: "fair",
      color_ojos: "blue",
      ano_nacimiento: "19BBY",
      genero: "male",
      mundo: "https://swapi.py4e.com/api/planets/1/",
      peliculas: [
        "https://swapi.py4e.com/api/films/1/",
        "https://swapi.py4e.com/api/films/2/",
        "https://swapi.py4e.com/api/films/3/",
        "https://swapi.py4e.com/api/films/6/",
        "https://swapi.py4e.com/api/films/7/",
      ],
      especies: ["https://swapi.py4e.com/api/species/1/"],
      creado: "2014-12-09T13:50:51.644000Z",
      editado: "2014-12-20T21:17:56.891000Z",
      vehiculos: [
        "https://swapi.py4e.com/api/vehicles/14/",
        "https://swapi.py4e.com/api/vehicles/30/",
      ],
      naves: [
        "https://swapi.py4e.com/api/starships/12/",
        "https://swapi.py4e.com/api/starships/22/",
      ],
      enlace: "https://swapi.py4e.com/api/people/1/",
    };

    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: mockAxiosResponseData,
    });

    const result: any = await getData(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockResponseData);
    expect(axios.get).toHaveBeenCalledWith(
      "https://swapi.py4e.com/api/people/1"
    );
  });

  it("should return data from DynamoDB when path is /book/{id}", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      rawPath: "/books/1", // Mock the path
      pathParameters: { id: "1" }, // Mock the path parameters
    } as unknown as APIGatewayProxyEvent;

    const mockStoredBook = {
      bookId: "1",
      title: "Test Book",
      author: "Test Author",
      publicationYear: 2022,
      genre: "Test Genre",
      pageCount: 300,
    };

    (
      AWSMock.DynamoDB.DocumentClient.prototype.get as jest.Mock
    ).mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce({ Item: mockStoredBook }),
    });

    const result: any = await getData(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockStoredBook);
    expect(AWSMock.DynamoDB.DocumentClient.prototype.get).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: expect.any(String),
        Key: { bookId: "1" },
      })
    );
  });

  it("should return 404 for unknown path", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      rawPath: "/unknown/path", // Mock an unknown path
    } as unknown as APIGatewayProxyEvent;

    const result: any = await getData(mockEvent);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({ message: "Unknown path" });
  });
});
