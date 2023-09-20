import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import axios from "axios"; // axiosはHTTPクライアントです

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // リクエストボディの確認
  const requestBody = JSON.parse(event.body || "{}");
  const inputText = requestBody.text;

  if (!inputText) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "text is required" }),
    };
  }

  // ChatGPTに問い合わせる
  const response = await queryChatGPT(inputText);

  return {
    statusCode: 200,
    body: JSON.stringify({ response: response.data }),
  };
};

const queryChatGPT = async (text: string) => {
  // OpenAIのエンドポイントとAPIキーをセットアップする必要があります
  const ENDPOINT = "https://api.openai.com/v2/engines/davinci/completions";
  const API_KEY = "YOUR_OPENAI_API_KEY"; // 実際のキーを使用してください

  return await axios.post(
    ENDPOINT,
    {
      prompt: text,
      max_tokens: 150, // 必要に応じて変更してください
    },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
};
