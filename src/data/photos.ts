// 自动扫描 public/images/photowall/ 中所有图片——无需手动更新文件名
const BASE = `${import.meta.env.BASE_URL}images/photowall`;

const imageModules = import.meta.glob<{ default: string }>(
  '/public/images/photowall/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,WEBP}',
  { eager: true, query: '?url', import: 'default' },
);

// 提取文件名：'../public/images/photowall/xxx.jpg' → 'xxx.jpg'
const photoFiles = Object.keys(imageModules)
  .map((path) => path.split('/').pop()!)
  .sort();

// 1/3 竖长(520~640), 2/3 横宽(240~400)
const getHeight = (i: number) => {
  if (i % 3 === 0) return 520 + ((i * 97 + 31) % 4) * 40;
  return 240 + ((i * 173 + 59) % 5) * 40;
};

export const photoItems = photoFiles.map((file, i) => ({
  id: String(i + 1),
  img: `${BASE}/${file}`,
  url: `${BASE}/${file}`,
  height: getHeight(i),
}));
