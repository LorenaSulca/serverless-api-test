import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";

async function deleteStoredBook(id: string): Promise<any> {
  const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
  const tablename = process.env.PEOPLE_TABLE || ("books-table-dev" as string);

  return await dynamoDbClient
    .delete({
      TableName: tablename,
      Key: {
        bookId: id,
      },
    })
    .promise();
}

export const deleteBookById = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | { error: any }> => {
  try {
    const pathParameters = event.pathParameters;
    const id = pathParameters?.id;
    await deleteStoredBook(id as string);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Book deleted successfully",
      }),
    };
  } catch (error) {
    return {
      error,
    };
  }
};
