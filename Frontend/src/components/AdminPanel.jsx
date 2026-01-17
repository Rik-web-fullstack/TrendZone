"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, Package, Image, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API = import.meta.env.VITE_API_BASE_URL;

const AdminPanel = () => {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [deleteImageIds, setDeleteImageIds] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [Category, setCategory] = useState("");
  const [SubCategory, setSubCategory] = useState("");

  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const categories = {
    furniture: ["sofa & sectionals", "chairs", "tables", "beds", "wardrobes"],
    lighting: ["ceiling lights", "table lamps", "floor lamps", "wall lights"],
    outdoors: ["garden furniture", "planters", "outdoor decor"],
    indoors: ["home decor", "wall art", "mirrors", "rugs"],
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviewUrls(selected.map((f) => URL.createObjectURL(f)));
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await axios.get(`${API}/api/products`);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
        alert("✅ Product updated");
      } else {
        if (files.length === 0) return alert("Upload at least one image");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("Category", Category);
        formData.append("SubCategory", SubCategory);
        files.forEach((f) => formData.append("images", f));

        await axios.post(`${API}/api/admin/add-product`, formData, {
          withCredentials: true,
        });
        alert("✅ Product added");
      }

      resetForm();
      fetchProducts();
    } catch {
      alert("❌ Action failed");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateImages = async () => {
    if (!editingProduct) return;

    try {
      const formData = new FormData();

      deleteImageIds.forEach((id) =>
  formData.append("deleteImageIds[]", id)
);

      files.forEach((f) => formData.append("images", f));

      await axios.put(
        `${API}/api/admin/update-product-images/${editingProduct._id}`,
        formData,
        { withCredentials: true }
      );

      alert("✅ Images updated");
      setFiles([]);
      setPreviewUrls([]);
      setDeleteImageIds([]);
      fetchProducts();
    } catch {
      alert("❌ Image update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await axios.delete(`${API}/api/admin/delete-product/${id}`, {
      withCredentials: true,
    });
    setProducts((p) => p.filter((x) => x._id !== id));
  };

  const handleEdit = (p) => {
    setEditingProduct(p);
    setName(p.name);
    setPrice(p.price);
    setDescription(p.description);
    setCategory(p.Category);
    setSubCategory(p.SubCategory);
    setFiles([]);
    setPreviewUrls([]);
    setDeleteImageIds([]);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setCategory("");
    setSubCategory("");
    setFiles([]);
    setPreviewUrls([]);
    setDeleteImageIds([]);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package /> Admin Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
          <DashboardCard icon={<Package />} title="Products" value={products.length} />
          <DashboardCard icon={<Layers />} title="Categories" value={Object.keys(categories).length} />
          <DashboardCard icon={<Image />} title="Images Selected" value={files.length} />
          <DashboardCard
            icon={<Pencil />}
            title="Mode"
            value={editingProduct ? "Editing" : "Adding"}
            highlight
          />
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-20"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Plus /> {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input className="input" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="input" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
            <textarea className="input md:col-span-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

            <select className="input" value={Category} onChange={(e) => { setCategory(e.target.value); setSubCategory(""); }}>
              <option value="">Select Category</option>
              {Object.keys(categories).map((c) => <option key={c}>{c}</option>)}
            </select>

            <select className="input" value={SubCategory} disabled={!Category} onChange={(e) => setSubCategory(e.target.value)}>
              <option value="">Select Sub Category</option>
              {Category && categories[Category].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {!editingProduct && (
            <div className="mt-6">
              <label className="font-medium text-gray-700 mb-2 block">
                Product Images
              </label>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} />
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {previewUrls.map((u, i) => (
                    <img key={i} src={u} className="h-24 w-full object-cover rounded-lg border" />
                  ))}
                </div>
              )}
            </div>
          )}

          {editingProduct && (
            <div className="mt-8">
              <h3 className="font-semibold mb-3 text-gray-700">Existing Images</h3>

              <div className="grid grid-cols-3 gap-3">
                {editingProduct.Prod_img.map((img) => (
                  <div key={img.public_id} className="relative">
                    <img
                      src={img.url}
                      className={`h-24 w-full object-cover rounded-lg border ${
                        deleteImageIds.includes(img.public_id)
                          ? "opacity-40 grayscale"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteImageIds((prev) =>
                          prev.includes(img.public_id)
                            ? prev.filter((x) => x !== img.public_id)
                            : [...prev, img.public_id]
                        )
                      }
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="font-medium text-gray-700 block mb-1">
                  Add New Images
                </label>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} />
              </div>

              <button
                type="button"
                onClick={handleUpdateImages}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
              >
                Update Images
              </button>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg">
              {uploading ? "Processing..." : editingProduct ? "Save Changes" : "Add Product"}
            </button>
            {editingProduct && (
              <button type="button" onClick={resetForm} className="px-6 py-2 rounded-lg bg-gray-200">
                Cancel
              </button>
            )}
          </div>
        </motion.form>

        <h3 className="text-2xl font-semibold mb-6">Products</h3>

        {loadingProducts ? (
          <p>Loading...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {products.map((p) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-xl shadow hover:shadow-2xl transition p-4"
                >
                  <img
  src={
    typeof p.Prod_img?.[0] === "string"
      ? p.Prod_img[0]
      : p.Prod_img?.[0]?.url
  }
  className="h-48 w-full object-cover rounded-lg mb-3"
/>

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
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, value, highlight }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className={`rounded-2xl p-6 shadow-lg bg-white ${
      highlight ? "border-2 border-indigo-500" : ""
    }`}
  >
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </motion.div>
);

export default AdminPanel;
