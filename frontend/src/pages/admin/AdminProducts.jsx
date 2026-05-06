import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from "react-icons/fi";

const EMPTY = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  category: "Women",
  subCategory: "",
  stock: "",
  sizes: [],
  colors: [],
  images: [],
  featured: false,
  trending: false,
};
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const CATEGORIES = ["Women", "Men", "Kids", "Accessories", "Fragrances"];

const AdminProducts = () => {
  const { user } = useSelector((s) => s.auth);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [colorInput, setColorInput] = useState({ name: "", hex: "#000000" });
  const headers = { Authorization: `Bearer ${user?.token}` };

  const fetchProducts = async () => {
    const res = await axios.get("/api/products?limit=100");
    setProducts(res.data.products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAdd = () => {
    setForm(EMPTY);
    setEditing(null);
    setShowModal(true);
  };
  const openEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice || "",
      category: p.category,
      subCategory: p.subCategory || "",
      stock: p.stock,
      sizes: p.sizes,
      colors: p.colors,
      images: p.images,
      featured: p.featured,
      trending: p.trending,
    });
    setEditing(p._id);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleSize = (size) =>
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...f.sizes, size],
    }));
  const addColor = () => {
    if (!colorInput.name) return;
    setForm((f) => ({ ...f, colors: [...f.colors, { ...colorInput }] }));
    setColorInput({ name: "", hex: "#000000" });
  };
  const removeColor = (name) =>
    setForm((f) => ({ ...f, colors: f.colors.filter((c) => c.name !== name) }));
  const removeImage = (idx) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      // 'images' naam same hona chahiye backend se
      Array.from(files).forEach((f) => formData.append("images", f));

      const res = await axios.post("/api/upload", formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", res.data); // Console mein check karo
      setForm((f) => ({ ...f, images: [...f.images, ...res.data] }));
      toast.success(`${res.data.length} image(s) uploaded!`);
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Upload failed");
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice) || 0,
        category: form.category,
        subCategory: form.subCategory,
        stock: Number(form.stock),
        sizes: form.sizes,
        colors: form.colors,
        images: form.images,
        featured: form.featured,
        trending: form.trending,
      };
      if (editing) {
        await axios.put(`/api/products/${editing}`, data, { headers });
        toast.success("Updated!");
      } else {
        await axios.post("/api/products", data, { headers });
        toast.success("Added!");
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    await axios.delete(`/api/products/${id}`, { headers });
    toast.success("Deleted!");
    fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-4xl">Products</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors"
        >
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Image",
                "Name",
                "Category",
                "Price",
                "Stock",
                "Featured",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-bold tracking-widest uppercase text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img
                    src={p.images[0]?.url || "https://via.placeholder.com/60"}
                    alt={p.name}
                    className="w-12 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-3 font-medium max-w-[180px] truncate">
                  {p.name}
                </td>
                <td className="px-4 py-3">
                  <span className="bg-yellow-50 text-gold text-xs font-bold px-2 py-1 rounded-full">
                    {p.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {p.discountPrice > 0 ? (
                    <>
                      <s className="text-gray-400">${p.price}</s>{" "}
                      <b>${p.discountPrice}</b>
                    </>
                  ) : (
                    <b>${p.price}</b>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={p.stock < 10 ? "text-red-500 font-bold" : ""}
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">{p.featured ? "⭐" : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="w-8 h-8 bg-blue-50 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="w-8 h-8 bg-red-50 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-7 py-5 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="font-display text-2xl">
                {editing ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-black text-xl"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-7 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">
                    Product Name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded outline-none focus:border-black font-body"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded outline-none focus:border-black font-body"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">
                    Sub Category
                  </label>
                  <input
                    name="subCategory"
                    value={form.subCategory}
                    onChange={handleChange}
                    placeholder="e.g. Tops, Dresses"
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded outline-none focus:border-black font-body"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded outline-none focus:border-black font-body"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">
                    Discount Price ($)
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={form.discountPrice}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded outline-none focus:border-black font-body"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded outline-none focus:border-black font-body"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  required
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded outline-none focus:border-black font-body resize-none"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">
                  Sizes
                </label>
                <div className="flex gap-2 flex-wrap">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={`px-4 py-1.5 border-2 rounded text-xs font-bold transition-colors ${form.sizes.includes(s) ? "bg-black text-white border-black" : "border-gray-200 hover:border-black"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">
                  Colors
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    placeholder="Color name e.g. Red"
                    value={colorInput.name}
                    onChange={(e) =>
                      setColorInput((c) => ({ ...c, name: e.target.value }))
                    }
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded outline-none focus:border-black font-body text-sm"
                  />
                  <input
                    type="color"
                    value={colorInput.hex}
                    onChange={(e) =>
                      setColorInput((c) => ({ ...c, hex: e.target.value }))
                    }
                    className="w-12 h-10 rounded border cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="px-4 py-2 border-2 border-black text-xs font-bold hover:bg-black hover:text-white transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.colors.map((c) => (
                    <span
                      key={c.name}
                      className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ background: c.hex }}
                      />
                      {c.name}
                      <button
                        type="button"
                        onClick={() => removeColor(c.name)}
                        className="text-gray-400 hover:text-red-500 ml-1"
                      >
                        <FiX size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* IMAGE UPLOAD — File Upload */}
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">
                  Product Images
                </label>
                <label
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${uploading ? "border-gold bg-yellow-50" : "border-gray-300 hover:border-black bg-gray-50"}`}
                >
                  <FiUpload className="text-2xl text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    {uploading ? "Uploading..." : "Click to upload images"}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    JPG, PNG, WEBP (max 5MB each)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {/* Preview */}
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={img.url}
                          alt=""
                          className="w-20 h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow"
                        >
                          <FiX size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex gap-6 p-4 bg-gray-50 rounded-lg">
                {[
                  { label: "⭐ Featured Product", name: "featured" },
                  { label: "🔥 Trending", name: "trending" },
                ].map((t) => (
                  <label
                    key={t.name}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name={t.name}
                      checked={form[t.name]}
                      onChange={handleChange}
                      className="w-4 h-4 accent-black"
                    />
                    <span className="text-sm font-medium">{t.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 border-2 border-black text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="px-6 py-2.5 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-60"
                >
                  {loading
                    ? "Saving..."
                    : editing
                      ? "Update Product"
                      : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
