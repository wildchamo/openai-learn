// Utility to validate and upload a base64 data-URI image to an R2 bucket
// Returns the public URL for the stored image.
// Allowed formats: PNG, JPG, WEBP.

const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'] as const;

type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number];

function extractExtensionFromDataUri(dataUri: string): AllowedExtension {
	const match = dataUri.match(/^data:image\/(png|jpeg|jpg|webp);base64,/i);
	if (!match) {
		throw new Error('Formato de imagen no soportado. Solo se permiten PNG, JPG o WEBP.');
	}
	const ext = match[1].toLowerCase();
	return (ext === 'jpeg' ? 'jpg' : ext) as AllowedExtension;
}

function mimeTypeFromExt(ext: AllowedExtension): string {
	switch (ext) {
		case 'png':
			return 'image/png';
		case 'jpg':
			return 'image/jpeg';
		case 'webp':
			return 'image/webp';
		default:
			return 'application/octet-stream';
	}
}

function generateRandomKey(ext: AllowedExtension): string {
	const randomPart = crypto.randomUUID().replace(/-/g, '');
	return `${randomPart}.${ext}`;
}

export async function uploadImageToBucket(dataUri: string, bucket: R2Bucket): Promise<string> {
	const ext = extractExtensionFromDataUri(dataUri);
	const key = generateRandomKey(ext);
	const contentType = mimeTypeFromExt(ext);

	// Extraer el segmento base64 y convertirlo a ArrayBuffer
	const base64Data = dataUri.split(',')[1];
	const binaryString = atob(base64Data);
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}

	await bucket.put(key, bytes, {
		httpMetadata: { contentType }
	});

	const object = await bucket.get(key);
	if (!object) {
		throw new Error('Error al subir la imagen al bucket');
	}


	console.log(object);
	// Ajusta esta URL si usas un dominio/ruta diferente para servir imágenes
	return object.text();
}
