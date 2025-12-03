import { StyleCategory, TransformStyle } from './types';

export const TRANSFORM_STYLES: TransformStyle[] = [
  {
    id: 'corp-suit',
    name: 'কর্পোরেট স্যুট',
    category: StyleCategory.PROFESSIONAL,
    promptSuffix: 'wearing a high-end professional corporate suit, office background, 8k resolution, photorealistic',
    thumbnail: 'https://picsum.photos/id/1/100/100'
  },
  {
    id: 'studio-headshot',
    name: 'স্টুডিও হেডশট',
    category: StyleCategory.PROFESSIONAL,
    promptSuffix: 'professional studio headshot, grey gradient background, soft professional lighting, sharp focus',
    thumbnail: 'https://picsum.photos/id/64/100/100'
  },
  {
    id: 'saree-elegant',
    name: 'এলিগেন্ট শাড়ি',
    category: StyleCategory.ETHNIC,
    promptSuffix: 'wearing a traditional elegant saree with intricate embroidery, cultural festival background, cinematic lighting',
    thumbnail: 'https://picsum.photos/id/65/100/100'
  },
  {
    id: 'punjabi-royal',
    name: 'রয়াল পাঞ্জাবি',
    category: StyleCategory.ETHNIC,
    promptSuffix: 'wearing a royal sherwani punjabi, south asian wedding atmosphere, golden hour lighting',
    thumbnail: 'https://picsum.photos/id/66/100/100'
  },
  {
    id: 'fashion-model',
    name: 'ফ্যাশন মডেল',
    category: StyleCategory.MODEL,
    promptSuffix: 'high fashion editorial look, vogue style magazine cover pose, urban street background, trendy outfit',
    thumbnail: 'https://picsum.photos/id/67/100/100'
  },
  {
    id: 'cyberpunk',
    name: 'সাইবারপাঙ্ক',
    category: StyleCategory.CREATIVE,
    promptSuffix: 'cyberpunk style, neon lights, futuristic city background, glowing accessories',
    thumbnail: 'https://picsum.photos/id/68/100/100'
  }
];

export const ASPECT_RATIOS = [
  { label: 'YouTube (16:9)', value: '16:9' },
  { label: 'Instagram (1:1)', value: '1:1' },
  { label: 'Story (9:16)', value: '9:16' },
];
