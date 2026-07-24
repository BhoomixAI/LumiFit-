const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Direct configuration
const supabaseUrl = 'https://ikudmmqnrsyoejfmmsyu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrdWRtbXFucnN5b2VqZm1tc3l1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgxODc3NSwiZXhwIjoyMTAwMzk0Nzc1fQ.gvuwhs0bU_c6BFJz5k44ObLFm3ctbiPltXMfNcN8s5c'; // Replace this with your actual long service_role secret key

const supabase = createClient(supabaseUrl, supabaseKey);

async function importCatalog() {
  try {
    const filePath = path.join(__dirname, 'src', 'data', 'catalog.json');
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Could not find catalog.json at: ${filePath}`);
      process.exit(1);
    }

    const rawData = fs.readFileSync(filePath, 'utf8');
    const catalogItems = JSON.parse(rawData);

    console.log(`📦 Found ${catalogItems.length} items in catalog.json. Uploading to Supabase...`);

    const { data, error } = await supabase
      .from('catalog_items')
      .insert(catalogItems);

    if (error) {
      console.error('❌ Error inserting data:', error.message);
      return;
    }

    console.log('✅ Successfully imported all catalog items into Supabase!');
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

importCatalog();