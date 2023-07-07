import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

type ResponseData = {
  url: string | undefined;
};

interface GenerateRequest extends NextApiRequest {
  body: {
    prompt: string;
    n: number;
    size: string;
  };
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(
  request: Request,
  res: NextApiResponse<ResponseData>
) {
  const body = await request.json();
  const promptString = body.prompt;

  if (!promptString) {
    return new Response("you need a prompt", { status: 400 });
  }

  const aiResponse = await openai.createImage({
    prompt: promptString,
    n: 1,
    size: "512x512",
  });

  const imageUrl = aiResponse.data.data[0].url;
  return NextResponse.json({ url: imageUrl }, { status: 200 });
}
