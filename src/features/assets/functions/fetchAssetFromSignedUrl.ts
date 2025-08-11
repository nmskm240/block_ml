export default async function fetchAssetFromSignedUrl(params: {
  url: string;
  fileName: string;
}) {
  const res = await fetch(params.url);
  if (!res.ok) {
    throw new Error(`Failed to fetch file from URL: ${params.url}`);
  }

  const blob = await res.blob();
  return new File([blob], params.fileName, { type: blob.type });
}
