// Utility for lazy-loading Anthropic SDK to prevent build-time issues
// This ensures the SDK is only loaded when actually used at runtime

let anthropicClient: any = null;

export async function getAnthropicClient() {
  if (!anthropicClient) {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });
  }
  return anthropicClient;
}
