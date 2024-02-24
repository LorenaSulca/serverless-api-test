import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

async function createBook(book: Book): Promise<Book> {
  const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
  const tablename = process.env.PEOPLE_TABLE || ("books-table-dev" as string);

  await dynamoDbClient
    .put({
      TableName: tablename,
      Item: book,
    })
    .promise();
  return book as Book;
}

export const storeBook = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | { error: any }> => {
  try {
    const { title, author, publicationYear, genre, pageCount } = JSON.parse(
      event.body!
    );
    const book = {
      bookId: uuidv4(),
      title,
      author,
      publicationYear,
      genre,
      pageCount,
    } as Book;
    const storedBook = await createBook(book);
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: storedBook,
        message: "Book saved successfully",
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
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
