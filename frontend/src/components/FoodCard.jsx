// src/components/FoodCard.jsx
export default function FoodCard({ item, onAddToCart }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
      <img
        src={item.image_url || '/placeholder-food.png'}
        alt={item.name}
        className="w-full h-40 object-cover rounded-lg"
      />
      <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
      <p className="text-orange-500 font-bold">LKR {item.price.toFixed(2)}</p>
      <button
        onClick={() => onAddToCart(item)}
        className="mt-auto bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
      >
        Add to Cart
      </button>
    </div>
  )
}