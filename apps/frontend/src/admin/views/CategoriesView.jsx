import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Edit2, Package } from 'lucide-react';
import { adminApi } from '../adminApi';

export default function CategoriesView() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', image: '' });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('[Categories Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createCategory(formData);
      setIsAddModalOpen(false);
      setFormData({ name: '', slug: '', description: '', image: '' });
      await fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id, productCount) => {
    if (productCount > 0) {
      alert(`Cannot delete this category because it has ${productCount} active products.`);
      return;
    }
    if (!window.confirm('Delete this category?')) return;
    try {
      await adminApi.deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">Produce Categories</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Organize produce taxonomies, icons, and marketplace navigation
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="h-36 bg-stone-100 overflow-hidden relative">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5 bg-stone-900/80 text-white px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
                  <Package className="w-3 h-3 text-emerald-400" />
                  <span>{cat.productCount || 0} Products</span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-stone-900 text-base">{cat.name}</h3>
                  <code className="text-[10px] bg-stone-100 px-2 py-0.5 rounded font-mono text-stone-600">
                    {cat.slug}
                  </code>
                </div>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {cat.description || 'Organic harvest classification.'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleDelete(cat._id, cat.productCount)}
                className="p-2 text-stone-400 hover:text-rose-600 transition"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-stone-900">Add New Produce Category</h3>
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                    })
                  }
                  placeholder="e.g. Exotic Berries"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 outline-hidden font-mono text-stone-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description of harvest category..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 rounded-xl"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

