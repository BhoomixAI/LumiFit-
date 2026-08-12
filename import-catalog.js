const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Direct configuration
const supabaseUrl = 'https://ikudmmqnrsyoejfmmsyu.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error(
    'Supabase service_role key is missing. Set the SUPABASE_SERVICE_ROLE_KEY environment variable before running this script.'
  );
  process.exit(1);
}

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

importCatalog(