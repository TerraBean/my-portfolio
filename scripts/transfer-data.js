const { neon } = require('@neondatabase/serverless');

// Database connections
const sourceDb = neon('postgresql://neondb_owner:npg_kB0yUrqcg6pd@ep-black-glade-a46muedm-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require');
const targetDb = neon('postgresql://neondb_owner:npg_Dl5GucfaZYS9@ep-frosty-boat-abcvz7ro-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require');

// Tables to migrate in order (respecting foreign key constraints)
const tables = [
  'users',
  'categories',
  'tags',
  'blog_posts',
  'blog_post_categories',
  'blog_post_tags'
];

async function transferData() {
  try {
    console.log('Starting data transfer...');

    for (const tableName of tables) {
      console.log(`\nTransferring data for table: ${tableName}`);
      
      // Get data from source database
      const sourceData = await sourceDb.query(`SELECT * FROM "${tableName}"`);
      console.log(`Found ${sourceData.length} rows in source database`);
      
      if (sourceData.length === 0) {
        console.log(`No data to transfer for ${tableName}`);
        continue;
      }
      
      // Clear existing data in target table
      await targetDb.query(`DELETE FROM "${tableName}"`);
      console.log(`Cleared existing data in target table`);
      
      // Insert data row by row
      let successCount = 0;
      for (const row of sourceData) {
        try {
          const columns = Object.keys(row);
          const columnsList = columns.map(col => `"${col}"`).join(', ');
          
          // Create values string with proper SQL escaping
          const valuesList = columns.map(col => {
            const val = row[col];
            if (val === null) return 'NULL';
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            if (val instanceof Date) return `'${val.toISOString()}'`;
            if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
            return val;
          }).join(', ');
          
          // Insert the row
          const insertQuery = `
            INSERT INTO "${tableName}" (${columnsList})
            VALUES (${valuesList})
          `;
          
          await targetDb.query(insertQuery);
          successCount++;
        } catch (rowError) {
          console.error(`Error inserting row in ${tableName}:`, rowError.message);
        }
      }
      
      console.log(`Successfully transferred ${successCount} of ${sourceData.length} rows for ${tableName}`);
    }
    
    console.log('\nData transfer completed!');
  } catch (error) {
    console.error('Error during data transfer:', error);
  }
}

transferData();
