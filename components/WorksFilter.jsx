import { motion } from 'framer-motion';

export default function WorksFilter({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="flex flex-wrap gap-3 mb-10">
      {categories.map((category) => (
        <button
          key={category}
          className={`relative px-6 py-2 rounded-full text-sm transition-colors ${
            selectedCategory === category 
            ? 'text-black' 
            : 'text-white hover:text-gray-200'
          }`}
          onClick={() => setSelectedCategory(category)}
        >
          {selectedCategory === category && (
            <motion.span
              layoutId="activeCategoryBackground"
              className="absolute inset-0 bg-amber-500 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">
            {category}
          </span>
        </button>
      ))}
    </div>
  );
}
