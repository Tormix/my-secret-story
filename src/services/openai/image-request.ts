// Pure request construction, shared by native transport and protocol tests.
export function imageRequest(prompt: string, imageUrl?: string) {
  if (
    imageUrl &&
    (!/^data:image\/(png|jpeg|webp);base64,/.test(imageUrl) ||
      imageUrl.length > 14_000_000)
  )
    throw new Error("Foto de referencia no válida o demasiado grande.");
  return {
    url: `https://api.openai.com/v1/images/${imageUrl ? "edits" : "generations"}`,
    body: {
      model: "gpt-image-2",
      prompt,
      ...(imageUrl ? { images: [{ image_url: imageUrl }] } : {}),
      size: "1024x1536",
      quality: "low",
      n: 1,
      output_format: "png",
    },
  };
}
