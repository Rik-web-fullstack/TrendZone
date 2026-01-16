// AdminPanel.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

const AdminPanel = () => {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [Category, setCategory] = useState("");
  const [SubCategory, setSubCategory] = useState("");

  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  /* ================= CATEGORY MAP ================= */
  const categories = {
    furniture: ["sofa & sectionals", "chairs", "tables", "beds", "wardrobes", "storage units", "tv stands"],
    lighting: ["ceiling lights", "table lamps", "floor lamps", "wall lights", "pendant lights"],
    outdoors: ["garden furniture", "planters & pots", "outdoor decor", "accessories", "garden tools"],
    indoors: ["home decor", "wall art", "mirrors", "clocks", "rugs & carpets", "curtains"],
  };

  /* ================= FILE HANDLING ================= */
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviewUrls(selected.map((f) => URL.createObjectURL(f)));
  };

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await axios.get(`${API}/api/products`);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Fetch products failed:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Category || !SubCategory) {
      alert("Select category & subcategory");
      return;
    }

    try {
      setUploading(true);

      if (editingProduct) {
        // UPDATE (no image reupload here)
        await axios.put(
          `${API}/api/admin/update-product/${editingProduct._id}`,
          { name, price, description, Category, SubCategory },
          { withCredentials: true }
        );

        alert("✅ Product updated");
      } else {
        // ADD PRODUCT
        if (files.length === 0) {
          alert("Upload at least one image");
          return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("Category", Category);
        formData.append("SubCategory", SubCategory);
        files.forEach((f) => formData.append("images", f));

        await axios.post(
          `${API}/api/admin/add-product`,
          formData,
          { withCredentials: true }
        );

        alert("✅ Product uploaded");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Action failed");
    } finally {
      setUploading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(
        `${API}/api/admin/delete-product/${id}`,
        { withCredentials: true }
      );
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (p) => {
    setEditingProduct(p);
    setName(p.name);
    setPrice(p.price);
    setDescription(p.description);
    setCategory(p.Category);
    setSubCategory(p.SubCategory);
    setFiles([]);
    setPreviewUrls([]);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setCategory("");
    setSubCategory("");
    setFiles([]);
    setPreviewUrls([]);
    setEditingProduct(null);
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-6">

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto space-y-4 mb-12"
        >
          <h2 className="text-2xl font-bold text-center">
            {editingProduct ? "✏️ Edit Product" : "➕ Add Product"}
          </h2>

          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="input" required />
          <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="input" required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="input" />

          <select value={Category} onChange={(e) => { setCategory(e.target.value); setSubCategory(""); }} className="input" required>
            <option value="">Select Category</option>
            {Object.keys(categories).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={SubCategory} onChange={(e) => setSubCategory(e.target.value)} className="input" disabled={!Category} required>
            <option value="">Select SubCategory</option>
            {Category && categories[Category].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          {!editingProduct && (
            <input type="file" multiple accept="image/*" onChange={handleFileChange} />
          )}

          {previewUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {previewUrls.map((u, i) => (
                <img key={i} src={u} className="h-24 object-cover rounded" />
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button className="flex-1 bg-indigo-600 text-white py-2 rounded">
              {uploading ? "Processing..." : editingProduct ? "Save Changes" : "Upload"}
            </button>
            {editingProduct && (
              <button type="button" onClick={resetForm} className="px-4 bg-gray-200 rounded">
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* PRODUCTS */}
        <h3 className="text-2xl font-semibold mb-6">📦 Products</h3>

        {loadingProducts ? (
          <p>Loading...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p._id} className="bg-white p-4 rounded-xl shadow">
                <img
                  src={p.Prod_img?.[0]}
                  alt={p.name}
                  className="h-48 w-full object-cover rounded mb-3"
                />
                <h4 className="font-semibold">{p.name}</h4>
                <p className="text-sm text-gray-500">{p.description}</p>
                <p className="font-bold mt-2">₹{p.price}</p>

                <div className="flex justify-between mt-4">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 flex gap-1">
                    <Pencil size={16} /> Edit
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-600 flex gap-1">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
