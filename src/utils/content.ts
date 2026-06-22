export function normalizeContentSlug(id: string): string {
	return id.replace(/\/index$/, "");
}
