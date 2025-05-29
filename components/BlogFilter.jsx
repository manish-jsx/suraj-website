export default function BlogFilter({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="overflow-x-auto pb-2 mb-4">
      <div className="flex space-x-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === category 
              ? 'bg-amber-500 text-black' 
              : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
