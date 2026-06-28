import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({
  endpoint: process.env.B2_ENDPOINT!,
  region: process.env.B2_REGION!,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APPLICATION_KEY!,
  },
  forcePathStyle: true,
});

export async function getB2SignedUrl(
  b2Key: string,
  expiresInSeconds = 3600,
  filename?: string
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME!,
    Key: b2Key,
    ResponseContentDisposition: filename
      ? `attachment; filename="${filename}"`
      : undefined,
  });

  return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

export async function getB2PublicUrl(b2Key: string): Promise<string> {
  return `${process.env.B2_ENDPOINT}/${process.env.B2_BUCKET_NAME}/${b2Key}`;
}

export async function uploadB2File(
  b2Key: string,
  body: Buffer | Uint8Array,
  contentType?: string
): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME!,
    Key: b2Key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(command);
}
