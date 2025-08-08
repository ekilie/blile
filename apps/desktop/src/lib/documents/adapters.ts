import { readTextFile, writeTextFile } from '@tauri-apps/api/fs';
// @ts-expect-error - mammoth has no types bundled
import mammoth from 'mammoth';
import { setEditorContent } from '@/utils';
import { get } from 'svelte/store';
import { editor } from '@/store';
import { convertToPdf } from '@/documents/exporters';

export interface OpenResult {
	kind: 'text';
	path: string;
	format: string;
}

export interface DocumentAdapter {
	canOpen: (path: string) => boolean;
	open: (path: string) => Promise<OpenResult>;
	save: (path: string) => Promise<void>;
	exportPdf?: (path: string, targetPath: string) => Promise<void>;
}

const TEXT_EXT = ['.md', '.txt'];

export class MarkdownAdapter implements DocumentAdapter {
	canOpen(path: string) {
		return TEXT_EXT.some((ext) => path.toLowerCase().endsWith(ext));
	}
	async open(path: string): Promise<OpenResult> {
		const content = await readTextFile(path);
		setEditorContent(content);
		return { kind: 'text', path, format: 'markdown' };
	}
	async save(path: string) {
		const $editor = get(editor);
		let content = $editor.storage.markdown.getMarkdown();
		content = content.replace(/^# .*(\n|$)/, '');
		await writeTextFile(path, content);
	}
	async exportPdf(_path: string, targetPath: string) {
		await convertToPdf(targetPath);
	}
}

async function readBinary(path: string): Promise<ArrayBuffer> {
	const win = window as unknown as {
		__TAURI__?: { fs?: { readBinaryFile: (p: string) => Promise<Uint8Array> } };
	};
	if (!win.__TAURI__?.fs?.readBinaryFile) throw new Error('Binary read not available');
	const bytes: Uint8Array = await win.__TAURI__.fs.readBinaryFile(path);
	return bytes.buffer.slice(0) as ArrayBuffer;
}

export class DocxAdapter implements DocumentAdapter {
	canOpen(path: string) {
		return path.toLowerCase().endsWith('.docx');
	}
	async open(path: string): Promise<OpenResult> {
		const arrayBuffer = await readBinary(path);
		const result = await mammoth
			.convertToHtml({ arrayBuffer })
			.catch(() => ({ value: '<p>(Failed to convert DOCX)</p>' }));
		const html = result.value as string;
		const $editor = get(editor);
		$editor.commands.setContent(html, true);
		return { kind: 'text', path, format: 'docx' };
	}
	async save(path: string) {
		// Not implemented: save as markdown alongside original
		const mdPath = path.replace(/\.docx$/i, '.md');
		const $editor = get(editor);
		const content = $editor.storage.markdown.getMarkdown();
		await writeTextFile(mdPath, content);
	}
	async exportPdf(_path: string, targetPath: string) {
		await convertToPdf(targetPath);
	}
}

export const adapters: DocumentAdapter[] = [new MarkdownAdapter(), new DocxAdapter()];
export function pickAdapter(path: string): DocumentAdapter | undefined {
	return adapters.find((a) => a.canOpen(path));
}
