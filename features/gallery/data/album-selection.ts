import type { GalleryAlbum } from "../types";
import type { GalleryProgramme } from "./programmes";

// One year button per programme/year, including when several albums share it.
export function getProgrammeAlbums(
  albums: GalleryAlbum[],
  programme: GalleryProgramme,
): GalleryAlbum[] {
  const groups = new Map<number | null, GalleryAlbum>();
  for (const album of albums) {
    if (album.programme !== programme || album.photos.length === 0) continue;
    const existing = groups.get(album.year);
    if (!existing) {
      groups.set(album.year, { ...album, photos: [...album.photos] });
    } else {
      existing.photos.push(...album.photos);
    }
  }
  return [...groups.values()].sort((a, b) => (b.year ?? -1) - (a.year ?? -1));
}

export function getLatestProgrammeAlbum(
  albums: GalleryAlbum[],
  programme: GalleryProgramme,
): GalleryAlbum | undefined {
  return getProgrammeAlbums(albums, programme)[0];
}
