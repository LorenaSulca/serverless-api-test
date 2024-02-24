import { APIGatewayProxyEvent } from "aws-lambda";
import { storeBook } from "./../../src/functions/storeBook/storeBook";
import AWSMock from "aws-sdk";

jest.mock("aws-sdk"); // Mock the entire AWS SDK

describe("storeBook", () => {
  beforeEach(() => {
    (AWSMock.DynamoDB.DocumentClient.prototype.put as jest.Mock).mockClear(); // Clear mock calls before each test
  });

  it("should store a book", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      body: JSON.stringify({
        title: "Test Book",
        author: "Test Author",
        publicationYear: 2022,
        genre: "Test Genre",
        pageCount: 300,
      }),
    } as APIGatewayProxyEvent;

    const mockStoredBook = {
      bookId: expect.any(String),
      ...JSON.parse(mockEvent.body!),
    };

    (
      AWSMock.DynamoDB.DocumentClient.prototype.put as jest.Mock
    ).mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce({}),
    });

    const result = await storeBook(mockEvent);

    if ("statusCode" in result && "body" in result) {
      expect(JSON.parse(result.body)).toEqual({
        data: mockStoredBook,
        message: "Book saved successfully",
      });
    }

    expect(AWSMock.DynamoDB.DocumentClient.prototype.put).toHaveBeenCalledTimes(
      1
    );
  });

  it("should return an error if book creation fails", async () => {
    const mockEvent: APIGatewayProxyEvent = {
      body: JSON.stringify({
        title: "Test Book",
        author: "Test Author",
        publicationYear: 2022,
        genre: "Test Genre",
        pageCount: 300,
      }),
    } as APIGatewayProxyEvent;

    (
      AWSMock.DynamoDB.DocumentClient.prototype.put as jest.Mock
    ).mockReturnValueOnce({
      promise: jest.fn().mockRejectedValueOnce("DynamoDB error"),
    });

    const result = await storeBook(mockEvent);

    expect(result).toEqual({ error: "DynamoDB error" });
    expect(AWSMock.DynamoDB.DocumentClient.prototype.put).toHaveBeenCalledTimes(
      1
    );
  });
});
