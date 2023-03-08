export default function normalizeFood(food) {
  if (typeof food !== 'string') return;
  const newFood = food
    .replace(/'/g, '"')
    .replace(/new ObjectId\("(.+)"\)/, '"$1"')
    .replace(/(\w+):/g, '"$1":');

  return JSON.parse(newFood);
}
