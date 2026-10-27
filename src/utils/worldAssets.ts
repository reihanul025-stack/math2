import heroFoxImg from '../assets/images/hero_fox_adventure_1793111295840.jpg';
import forestWorldImg from '../assets/images/forest_apple_world_1793111296351.jpg';
import villageWorldImg from '../assets/images/village_bakery_world_1793111296588.jpg';
import islandWorldImg from '../assets/images/tropical_island_world_1793111297360.jpg';
import castleWorldImg from '../assets/images/royal_castle_world_1793111297810.jpg';
import { WorldId } from '../types/game';

export const HERO_ILLUSTRATION = {
  src: heroFoxImg,
  alt: 'Kiko si Rubah Penjelajah memandang jalur petualangan menuju hutan, desa, pulau, dan kastel matematika',
  fallbackGradient: 'from-sky-100 via-emerald-50 to-amber-100',
};

export const WORLD_ILLUSTRATIONS: Record<
  WorldId,
  {
    src: string;
    alt: string;
    fallbackGradient: string;
  }
> = {
  1: {
    src: forestWorldImg,
    alt: 'Hutan Perkalian dengan pohon apel merah dan keranjang buah di tepi jalan setapak',
    fallbackGradient: 'from-emerald-100 via-green-50 to-lime-100',
  },
  2: {
    src: villageWorldImg,
    alt: 'Desa Pembagian dengan rumah roti hangat, piring kue, dan toples permen warna-warni',
    fallbackGradient: 'from-amber-100 via-orange-50 to-yellow-100',
  },
  3: {
    src: islandWorldImg,
    alt: 'Pulau Tantangan tropis dengan pantai pasir emas, pohon kelapa, dan peti harta karun',
    fallbackGradient: 'from-sky-100 via-cyan-50 to-teal-100',
  },
  4: {
    src: castleWorldImg,
    alt: 'Kastel Matematika megah dengan bendera emas dan jembatan batu di atas sungai jernih',
    fallbackGradient: 'from-indigo-100 via-blue-50 to-amber-100',
  },
};
