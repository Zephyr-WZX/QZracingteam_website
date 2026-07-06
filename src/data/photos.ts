const PHOTO_FILES = [
  'IMG_20260314_092103.jpg',
  'IMG_20260314_112825.jpg',
  'IMG_20260314_171618.jpg',
  'IMG_20260315_143317.jpg',
  'IMG_20260315_143336.jpg',
  'IMG_20260319_175703.jpg',
  'IMG_20260319_175741.jpg',
  'IMG_20260319_192704.jpg',
  'IMG_20260320_174501.jpg',
  'IMG_20260320_205919.jpg',
  'IMG_20260320_210050.jpg',
  'IMG_20260322_125640.jpg',
  'mmexport1773410697921.jpg',
  'mmexport1773410705066.jpg',
  'mmexport1773412828275.jpg',
  'mmexport1773983176612.jpg',
  'mmexport1774164869908.jpg',
  'mmexport28d4947688ec7397f9f3509bd6dd1195_1774085967538.jpeg',
  'mmexport51a4443cc0e81567a23ff738b3c02b67_1774085918179.jpeg',
  'mmexportb9ef66caf1c91d8129ec89921f078aa2_1774164613311.jpeg',
  'mmexportf9d05cf669fbee9c4b1fee603d4cb2c7_1774085774173.jpeg',
] as const;

const BASE = '/images/photowall';

export const photoItems = PHOTO_FILES.map((file, i) => ({
  id: String(i + 1),
  img: `${BASE}/${file}`,
  url: `${BASE}/${file}`,
  height: 220 + ((i * 137 + 59) % 5) * 55,
}));
