// AdminPanel.jsx

import React, { useState, useEffect } from "react";
import api from "../api/api"; // ✅ use centralized api
import { Pencil, Trash2 } from "lucide-react";

const AdminPanel = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [Category, setCategory] = useState("");
  const [SubCategory, setSubCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const categories = {
    furniture: ["sofa & sectionals", "chairs", "tables", "beds", "wardrobes", "storage units", "tv stands"],
    lighting: ["ceiling lights", "table lamps", "floor lamps", "wall lights", "pendant lights"],
    outdoors: ["garden furniture", "planters & pots", "outdoor decor", "accessories", "garden tools"],
    indoors: ["home decor", "wall art", "mirrors", "clocks", "rugs & carpets", "curtains"],
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setPreviewUrls(selectedFiles.map((file) => URL.createObjectURL(file)));
  };

  // ✅ Fetch products
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await api.get("/api/admin/products");
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Upload product
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!Category || !SubCategory) {
      alert("Please select both category and subcategory.");
      return;
    }

    if (files.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("price", price);
    formdata.append("description", description);
    formdata.append("Category", Category);
    formdata.append("SubCategory", SubCategory);
    files.forEach((file) => formdata.append("file", file));

    try {
      setUploading(true);
      const res = await api.post("/api/admin/products", formdata);

      if (res.data.success) {
        alert("✅ Product uploaded successfully!");
        fetchProducts();
        resetForm();
      } else {
        alert("⚠️ Upload failed.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Failed to upload product.");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setCategory("");
    setSubCategory("");
    setFiles([]);
    setPreviewUrls([]);
  };

  // ✅ Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/api/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Edit
  const handleEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setCategory(product.Category);
    setSubCategory(product.SubCategory);
  };

  // ✅ Update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/admin/products/${editingProduct._id}`, {
        name,
        price,
        description,
        Category,
        SubCategory,
      });

      alert("✅ Product updated!");
      setEditingProduct(null);
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Update failed:", error);
      alert("❌ Failed to update product.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* FORM */}
        <form
          onSubmit={editingProduct ? handleUpdate : handleUpload}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mx-auto space-y-4 mb-12"
        >
          <h2 className="text-2xl font-bold text-center">
            {editingProduct ? "Edit Product ✏️" : "Admin Panel – Add Product"}
          </h2>

          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" className="input" required />
          <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="input" required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="input" required />

          <select value={Category} onChange={(e) => { setCategory(e.target.value); setSubCategory(""); }} required>
            <option value="">Select Category</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select value={SubCategory} onChange={(e) => setSubCategory(e.target.value)} disabled={!Category} required>
            <option value="">Select SubCategory</option>
            {Category && categories[Category].map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          <input type="file" multiple onChange={handleFileChange} required={!editingProduct} />

          <button type="submit" disabled={uploading}>
            {editingProduct ? "Save Changes" : uploading ? "Uploading..." : "Upload Product"}
          </button>
        </form>

        {/* PRODUCTS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white p-4 rounded shadow">
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${product.Prod_img?.[0]}`}
                alt={product.name}
                className="h-48 w-full object-cover"
              />
              <h4>{product.name}</h4>
              <p>₹{product.price}</p>

              <div className="flex justify-between">
                <button onClick={() => handleEdit(product)}>
                  <Pencil size={16} /> Edit
                </button>
                <button onClick={() => handleDelete(product._id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
