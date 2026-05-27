// OpenAI image generation client.
// The API key is read from Vite env: set VITE_OPENAI_API_KEY in a .env file.

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
const ENDPOINT = 'https://api.openai.com/v1/images/generations';

export type ImageSize = '1024x1024' | '1024x1536' | '1536x1024';
export type Quality = 'low' | 'medium' | 'high';

export interface GenerateParams {
  prompt: string;
  size: ImageSize;
  quality: Quality;
}

export interface GenerateResult {
  /** data URL ready to drop into an <img src> */
  url: string;
  revisedPrompt?: string;
}

export function hasApiKey(): boolean {
  return Boolean(API_KEY && API_KEY.length > 10);
}

export async function generateIllustration(
  params: GenerateParams,
): Promise<GenerateResult> {
  if (!hasApiKey()) {
    throw new Error(
      'No OpenAI API key found. Add VITE_OPENAI_API_KEY to a .env file and restart the dev server.',
    );
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: params.prompt,
      size: params.size,
      quality: params.quality,
      n: 1,
    }),
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const err = await res.json();
      detail = err?.error?.message ?? detail;
    } catch {
      /* ignore parse errors */
    }
    throw new Error(detail);
  }

  const data = await res.json();
  const item = data?.data?.[0];
  if (!item?.b64_json) {
    throw new Error('The API returned no image data.');
  }

  return {
    url: `data:image/png;base64,${item.b64_json}`,
    revisedPrompt: item.revised_prompt,
  };
}
