export const CONTAINER_IMAGE_TYPES = [
  { key: '20DC', label: "20' DC (Standart)", defaultImage: '/20.webp' },
  { key: '40DC', label: "40' DC (Standart)", defaultImage: '/40.webp' },
  { key: '40HC', label: "40' HC (High Cube)", defaultImage: '/40h.webp' },
  { key: '45HC', label: "45' HC", defaultImage: null },
  { key: '40REEFER', label: "40' Reefer (Soğutmalı)", defaultImage: null },
  { key: 'OPENTOP', label: 'Open Top (Üstü Açılır)', defaultImage: null },
  { key: 'FLATRACK', label: 'Flat Rack', defaultImage: null },
] as const;

export type ContainerImageTypeKey = (typeof CONTAINER_IMAGE_TYPES)[number]['key'];

export interface ContainerImageMeta {
  id: number;
  container_type: ContainerImageTypeKey;
  url: string;
  created_at: string;
}

const VALID_TYPE_KEYS = new Set<string>(CONTAINER_IMAGE_TYPES.map((t) => t.key));

export function isValidContainerImageType(value: string): value is ContainerImageTypeKey {
  return VALID_TYPE_KEYS.has(value);
}
