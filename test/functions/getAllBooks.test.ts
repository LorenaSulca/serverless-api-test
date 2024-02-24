import { APIGatewayProxyEvent } from "aws-lambda";
import { getAllBooks } from "./../../src/functions/getAllBooks/getAllBooks";
import AWSMock from "aws-sdk";

jest.mock("aws-sdk"); // Mock the entire AWS SDK

describe("getAllBooks", () => {
  beforeEach(() => {
    (AWSMock.DynamoDB.DocumentClient.prototype.scan as jest.Mock).mockClear(); // Clear mock calls before each test
  });

  it("should return stored books", async () => {
    const mockEvent: APIGatewayProxyEvent = {} as APIGatewayProxyEvent;

    const mockStoredBooks = [
      {
        bookId: "1",
        title: "Mock Book 1",
        author: "Mock Author 1",
        publicationYear: 2020,
        genre: "Mock Genre 1",
        pageCount: 200,
      },
      {
        bookId: "2",
        title: "Mock Book 2",
        author: "Mock Author 2",
        publicationYear: 2021,
        genre: "Mock Genre 2",
        pageCount: 250,
      },
    ];

    (
      AWSMock.DynamoDB.DocumentClient.prototype.scan as jest.Mock
    ).mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce({ Items: mockStoredBooks }),
    });

    const result = await getAllBooks(mockEvent);

    if ("statusCode" in result) {
      expect(result.statusCode).toBe(200);
      const receivedBooks = JSON.parse(result.body!);
      expect(receivedBooks).toEqual(mockStoredBooks);
    }
    expect(
      AWSMock.DynamoDB.DocumentClient.prototype.scan
    ).toHaveBeenCalledTimes(1);
  });

  it("should return an error if fetching books fails", async () => {
    const mockEvent: APIGatewayProxyEvent = {} as APIGatewayProxyEvent;

    (
      AWSMock.DynamoDB.DocumentClient.prototype.scan as jest.Mock
    ).mockReturnValueOnce({
      promise: jest.fn().mockRejectedValueOnce("DynamoDB error"),
    });

    const result = await getAllBooks(mockEvent);

    expect(result).toEqual({ error: "DynamoDB error" });
    expect(
      AWSMock.DynamoDB.DocumentClient.prototype.scan
    ).toHaveBeenCalledTimes(1);
  });
});
