# Image Upload Setup Guide

## 🖼️ Image Upload Feature Added!

Your Slick Store now supports **direct image uploads** instead of URL inputs for product images.

## 🚀 Setup Required

### 1. **Set up Supabase Storage Bucket**

Run this SQL script in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of supabase-storage-setup.sql
```

This will:
- Create a `product-images` storage bucket
- Set up proper access policies for authenticated users
- Allow public viewing of product images

### 2. **Features Included**

✅ **Drag & Drop Upload** - Users can drag images directly onto the upload area  
✅ **Click to Upload** - Traditional file picker interface  
✅ **Image Preview** - See uploaded images before saving  
✅ **File Validation** - Only allows PNG, JPG, GIF up to 5MB  
✅ **Remove Images** - Easy removal with × button  
✅ **Progress Indicator** - Shows upload progress  
✅ **Error Handling** - Clear error messages for failed uploads  

### 3. **How It Works**

1. **Admin creates/edits product** → Upload area appears
2. **Click or drag image** → File validation occurs
3. **Image uploads to Supabase** → Stored in `product-images` bucket
4. **Public URL generated** → Automatically saved to product
5. **Preview shows** → Admin can see uploaded image

### 4. **Storage Structure**

```
product-images/
├── 1703123456789-abc123.jpg
├── 1703123456790-def456.png
└── 1703123456791-ghi789.gif
```

### 5. **Security**

- ✅ Only authenticated users can upload
- ✅ Public can view images (for product display)
- ✅ File type validation (images only)
- ✅ File size limit (5MB max)
- ✅ Unique filenames prevent conflicts

## 🎯 Usage

### For Admins:
1. Go to **Admin → Products → New Product** or **Edit Product**
2. Scroll to **Product Image** section
3. **Click "Click to upload"** or **drag image** onto the area
4. Wait for upload to complete
5. **Save product** - image URL is automatically included

### For Customers:
- Product images display normally from Supabase Storage URLs
- Fast loading with CDN delivery
- Responsive images for all devices

## 🔧 Technical Details

- **Storage**: Supabase Storage with `product-images` bucket
- **File Types**: PNG, JPG, GIF, WebP
- **Max Size**: 5MB per image
- **Naming**: Timestamp + random string for uniqueness
- **URLs**: Public URLs for immediate use

## 🚨 Important Notes

1. **Run the SQL script** in Supabase before using image upload
2. **Test upload** with a small image first
3. **Monitor storage usage** in Supabase dashboard
4. **Images are permanent** - deleting products doesn't auto-delete images

Your image upload feature is now ready! 🎉
