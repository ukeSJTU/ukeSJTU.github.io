import { type CollectionEntry, getCollection } from "astro:content";
import { normalizeContentSlug } from "@/utils/content";
import { collectionDateSort } from "@/utils/date";

export async function getAllProjects(): Promise<CollectionEntry<"project">[]> {
	const projects = await getCollection("project");
	return projects.sort((a, b) => {
		if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
		return collectionDateSort(a, b);
	});
}

export function getProjectSlug(project: CollectionEntry<"project">): string {
	return normalizeContentSlug(project.id);
}
