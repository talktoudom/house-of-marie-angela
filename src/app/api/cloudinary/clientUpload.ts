export async function uploadImageToCloudinary(file: File, folder = 'hma-products') {
  // 1) Get signature from your server
  const sigRes = await fetch('/api/cloudinary/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder }),
  })

  if (!sigRes.ok) {
    const text = await sigRes.text()
    throw new Error(`Failed to get Cloudinary signature: ${text}`)
  }

  const { signature, timestamp, cloudName, apiKey } = await sigRes.json()

  // 2) Upload directly to Cloudinary
  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', apiKey)
  formData.append('timestamp', String(timestamp))
  formData.append('signature', signature)
  formData.append('folder', folder)

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!uploadRes.ok) {
    const text = await uploadRes.text()
    throw new Error(`Cloudinary upload failed: ${text}`)
  }

  return uploadRes.json() as Promise<{
    secure_url: string
    public_id: string
    width?: number
    height?: number
    format?: string
  }>
}