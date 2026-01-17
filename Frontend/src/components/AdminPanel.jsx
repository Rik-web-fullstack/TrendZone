// AdminPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

const AdminPanel = () => {
  /* ================= STATE ================= */
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [Category, setCategory] = useState("");
  const [SubCategory, setSubCategory] = useState("");

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  /* ================= CATEGORY MAP ================= */
  const categories = {
    furniture: ["sofa & sectionals", "chairs", "tables", "beds", "wardrobes"],
    lighting: ["ceiling lights", "table lamps", "floor lamps"],
    outdoors: ["garden furniture", "planters", "decor"],
    indoors: ["home decor", "wall art", "mirrors"],
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
      setProducts(res.data.products || []);
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

    if (!Category || !SubCategory) return alert("Select category & subcategory");

    try {
      setUploading(true);

      if (editingProduct) {
        await axios.put(
          `${API}/api/admin/update-product/${editingProduct._id}`,
          { name, price, description, Category, SubCategory },
          { withCredentials: true }
        );
      } else {
        if (!files.length) return alert("Upload at least one image");

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
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    } finally {
      setUploading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await axios.delete(
        `${API}/api/admin/delete-product/${id}`,
        { withCredentials: true }
      );
      setProducts((p) => p.filter((x) => x._id !== id));
    } catch {
      alert("Delete failed");
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingProduct(null);
    setName("");
    setPrice("");
    setDescription("");
    setCategory("");
    setSubCategory("");
    setFiles([]);
    setPreviewUrls([]);
  };

  /* ================= FILTERED PRODUCTS ================= */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = filterCategory
        ? p.Category === filterCategory
        : true;
      return matchSearch && matchCategory;
    });
  }, [products, search, filterCategory]);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded shadow">
              Total Products: <b>{products.length}</b>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className={`bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto space-y-4 mb-14 ${
            editingProduct ? "border-2 border-indigo-500" : ""
          }`}
        >
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Plus /> {editingProduct ? "Edit Product" : "Add Product"}
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
            <div className="flex gap-2 overflow-x-auto">
              {previewUrls.map((u, i) => (
                <img key={i} src={u} className="h-24 w-24 object-cover rounded" />
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

        {/* SEARCH & FILTER */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center bg-white px-3 rounded shadow">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product..."
              className="outline-none px-2 py-1"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white px-3 py-2 rounded shadow"
          >
            <option value="">All Categories</option>
            {Object.keys(categories).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* PRODUCTS */}
        {loadingProducts ? (
          <p>Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div key={p._id} className="bg-white p-4 rounded-xl shadow">
                <img src={p.Prod_img?.[0]} className="h-48 w-full object-cover rounded mb-3" />
                <h4 className="font-semibold">{p.name}</h4>
                <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
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
