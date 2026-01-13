import React, { useState, useEffect } from "react";
import axios from "axios";
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

  // Category structure
  const categories = {
    furniture: ["sofa & sectionals", "chairs", "tables", "beds", "wardrobes", "storage units", "tv stands"],
    lighting: ["ceiling lights", "table lamps", "floor lamps", "wall lights", "pendant lights"],
    outdoors: ["garden furniture", "planters & pots", "outdoor decor", "accessories", "garden tools"],
    indoors: ["home decor", "wall art", "mirrors", "clocks", "rugs & carpets", "curtains"],
  };

  // Handle file previews
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  // Fetch all products (Admin)
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await axios.get("http://localhost:3000/api/admin/products");
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

  // Upload new product
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

    const res = await axios.post(
      "http://localhost:3000/api/admin/products",
      formdata,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (res.data.success) {
      alert("✅ Product uploaded successfully!");
      fetchProducts();
      resetForm();
    } else {
      alert("⚠️ Upload failed. Try again.");
    }
  } catch (error) {
    console.error(error);
    alert("❌ Failed to upload product.");
  } finally {
    setUploading(false);
  }
};


  // Reset form
  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setCategory("");
    setSubCategory("");
    setFiles([]);
    setPreviewUrls([]);
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setCategory(product.Category);
    setSubCategory(product.SubCategory);
  };

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/admin/products/${editingProduct._id}`, {
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
        {/* Form */}
        <form
          onSubmit={editingProduct ? handleUpdate : handleUpload}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mx-auto space-y-4 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            {editingProduct ? "Edit Product ✏️" : "Admin Panel – Add Product"}
          </h2>

          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            required
          />

          <input
            type="text"
            placeholder="Price (₹)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            required
          />

          <textarea
            placeholder="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            rows="3"
            required
          ></textarea>

          {/* Category */}
          <select
            value={Category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory("");
            }}
            className="w-full px-4 py-2 border rounded-md bg-white focus:ring-2 focus:ring-indigo-400"
            required
          >
            <option value="">Select Category</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          {/* SubCategory */}
          <select
            value={SubCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-white focus:ring-2 focus:ring-indigo-400"
            required
            disabled={!Category}
          >
            <option value="">
              {Category ? "Select SubCategory" : "Select Category first"}
            </option>
            {Category &&
              categories[Category].map((sub) => (
                <option key={sub} value={sub}>
                  {sub.charAt(0).toUpperCase() + sub.slice(1)}
                </option>
              ))}
          </select>

          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full border p-2 rounded-md bg-gray-50"
            required={!editingProduct}
          />

          {/* Previews */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-2">
              {previewUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Preview ${i}`}
                  className="w-full h-24 object-cover rounded-md border"
                />
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={uploading}
              className={`flex-1 ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white py-2 rounded-md font-semibold transition`}
            >
              {editingProduct ? "Save Changes" : uploading ? "Uploading..." : "Upload Product"}
            </button>

            {editingProduct && (
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Product List */}
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">📦 All Products</h3>
        {loadingProducts ? (
          <p className="text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition"
              >
                <img
                  src={`http://localhost:3000/uploads/${product.Prod_img?.[0]}`}
                  alt={product.name}
                  className="h-48 w-full object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-gray-800">{product.name}</h4>
                <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
                <p className="font-bold text-indigo-600 mt-2">₹{product.price}</p>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 font-semibold"
                  >
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
