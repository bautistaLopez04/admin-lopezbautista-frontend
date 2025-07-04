const images = import.meta.glob('../images/*.{jpg,jpeg,png,avif,webp}', { eager: true });

const imageMap = {};
for (const path in images) {
  const key = path.split('/').pop().split('.')[0];
  imageMap[key.toLowerCase()] = images[path].default;
}

export default imageMap;
