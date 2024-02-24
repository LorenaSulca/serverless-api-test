import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Datetime } from "aws-sdk/clients/costoptimizationhub";
import AWS from "aws-sdk";

async function getStoredBooks(): Promise<Book[]> {
  const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
  const tablename = process.env.PEOPLE_TABLE || ("books-table-dev" as string);

  const book = await dynamoDbClient
    .scan({
      TableName: tablename,
    })
    .promise();
  return book.Items as Book[];
}

export const getAllBooks = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | { error: any }> => {
  try {
    const storedBooks = await getStoredBooks();

    const items = storedBooks.map((book) => {
      return book;
    });

    return {
      statusCode: 200,
      body: JSON.stringify(items),
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
}
