import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Provide credentials directly for the migration script
const supabaseUrl = 'https://wqnkwcxttrcafpfekovk.supabase.co';
const supabaseKey = 'sb_publishable_1_eGjXdPsvxvU1xQ4WAL9Q_TpqQAQQw';
const supabase = createClient(supabaseUrl, supabaseKey);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the data
import { categories, menuData } from './src/data.js';

async function uploadAsset(localPath) {
  if (!localPath) return null;
  
  // localPath looks like "/assets/veg_maggie.jpg"
  // We need to read from public/assets/...
  const fullPath = path.join(__dirname, 'public', localPath);
  const fileName = path.basename(localPath);
  const storagePath = `${Date.now()}_${fileName}`;
  
  try {
    const fileBuffer = fs.readFileSync(fullPath);
    // Determine mime type basic
    const ext = path.extname(fileName).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';
    
    const { data, error } = await supabase.storage
      .from('assets')
      .upload(storagePath, fileBuffer, {
        contentType,
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error(`Error uploading ${fileName}:`, error.message);
      // Fallback: If upload fails (like if RLS blocked it), we just use the local path temporarily
      return localPath; 
    }
    
    // Return the public URL
    const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(storagePath);
    return publicUrl;
  } catch (err) {
    console.error(`Local file missing or error with ${localPath}:`, err.message);
    return localPath;
  }
}

async function migrate() {
  console.log('Starting Migration to Supabase...');
  
  for (const cat of categories) {
    console.log(`Migrating Category: ${cat.title}`);
    
    // Upload category image if exists
    let catImageUrl = null;
    if (cat.image) {
      catImageUrl = await uploadAsset(cat.image);
    }
    
    // Insert Category
    const { data: catData, error: catError } = await supabase
      .from('categories')
      .upsert({
        id: cat.id,
        title: cat.title,
        subtitle: cat.subtitle,
        image: catImageUrl || cat.image
      })
      .select();
      
    if (catError) {
      console.error(`Failed to insert category ${cat.id}:`, catError.message);
      continue;
    }
    
    // Now migrate its items
    const items = menuData[cat.id] || [];
    for (const item of items) {
      console.log(`  - Migrating Item: ${item.title}`);
      let itemImageUrl = null;
      if (item.image) {
        itemImageUrl = await uploadAsset(item.image);
      }
      
      const { error: itemError } = await supabase
        .from('menu_items')
        .insert({
          category_id: cat.id,
          title: item.title,
          price: item.price,
          secondary_price: item.secondaryPrice || null,
          image: itemImageUrl || item.image
        });
        
      if (itemError) {
        console.error(`    Failed to insert item ${item.title}:`, itemError.message);
      }
    }
  }
  
  console.log('Migration Complete!');
}

migrate();
