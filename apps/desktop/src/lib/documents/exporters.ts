import { get } from 'svelte/store';
import { editor } from '@/store';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { writeBinaryFile } from '@tauri-apps/api/fs';

export async function convertToPdf(targetPath: string) {
	const $editor = get(editor);
	const plain = $editor.getText();
	const pdfDoc = await PDFDocument.create();
	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const page = pdfDoc.addPage();
	const { width, height } = page.getSize();
	const fontSize = 12;
	const maxWidth = width - 72; // 1" margins
	const lines = wrapText(plain, font, fontSize, maxWidth);
	let y = height - 72;
	for (const line of lines) {
		if (y < 72) {
			y = height - 72;
			pdfDoc.addPage();
		}
		page.drawText(line, { x: 36, y, size: fontSize, font });
		y -= fontSize * 1.2;
	}
	const bytes = await pdfDoc.save();
	await writeBinaryFile(targetPath, bytes);
}

function wrapText(
	text: string,
	font: { widthOfTextAtSize: (t: string, s: number) => number },
	size: number,
	maxWidth: number
) {
	const words = text.split(/\s+/);
	const lines: string[] = [];
	let current = '';
	for (const w of words) {
		const test = current ? current + ' ' + w : w;
		const width = font.widthOfTextAtSize(test, size);
		if (width > maxWidth && current) {
			lines.push(current);
			current = w;
		} else {
			current = test;
		}
	}
	if (current) lines.push(current);
	return lines;
}
