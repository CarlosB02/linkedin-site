export async function downloadImage(url: string, filename: string) {
	try {
		// 1. Fazer o fetch da imagem
		const response = await fetch(url);
		if (!response.ok) throw new Error("Failed to fetch image");
		const blob = await response.blob();

		// 2. Converter para um File object (necessário para a Share API)
		const file = new File([blob], filename, { type: "image/jpeg" });

		// 3. Verificar suporte da Web Share API
		if (
			navigator.share &&
			navigator.canShare &&
			navigator.canShare({ files: [file] })
		) {
			try {
				await navigator.share({
					files: [file],
					title: filename,
				});
				// Se a partilha for efetuada com sucesso (ou cancelada pelo utilizador), saímos.
				return;
			} catch (shareError: any) {
				// Ignorar erros de cancelamento do utilizador
				if (shareError.name !== "AbortError") {
					console.error("Erro ao partilhar:", shareError);
				}
				// Se der erro ao partilhar (que não seja cancelamento), continua para o fallback.
			}
		}

		// Fallback: download padrão usando um Blob URL
		const blobUrl = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = blobUrl;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(blobUrl);
	} catch (error) {
		console.error("Falha no download da imagem:", error);
		// Fallback final: abre num novo separador (target="_blank") para long press
		window.open(url, "_blank");
	}
}
