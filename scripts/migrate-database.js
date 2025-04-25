const { neon } = require('@neondatabase/serverless');

// Database connections
const sourceDb = neon('postgresql://neondb_owner:npg_kB0yUrqcg6pd@ep-black-glade-a46muedm-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require');
const targetDb = neon('postgresql://neondb_owner:npg_Dl5GucfaZYS9@ep-frosty-boat-abcvz7ro-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require');

async function migrateDatabase() {
  try {
    // Get all table schemas
    const tables = await sourceDb`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;

    console.log(`Found ${tables.length} tables to migrate`);

    // First, create all tables with proper schema
    for (const { tablename } of tables) {
      console.log(`Creating table schema: ${tablename}`);

      try {
        // Get table schema
        const schema = await sourceDb`
          SELECT column_name, data_type, character_maximum_length, is_nullable
          FROM information_schema.columns
          WHERE table_name = ${tablename}
          AND table_schema = 'public'
          ORDER BY ordinal_position
        `;

        // Get primary key information
        const primaryKeys = await sourceDb`
          SELECT a.attname
          FROM pg_index i
          JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
          WHERE i.indrelid = ${tablename}::regclass
          AND i.indisprimary
        `;
        
        const primaryKeyColumns = primaryKeys.map(pk => pk.attname);
        console.log(`Primary keys for ${tablename}: ${primaryKeyColumns.join(', ') || 'None'}`);

        // Create table in target database
        const columnDefinitions = schema.map(col => {
          let type = col.data_type;
          if (col.character_maximum_length) {
            type += `(${col.character_maximum_length})`;
          }
          return `"${col.column_name}" ${type} ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`;
        }).join(',\n');

        // Add primary key constraint if exists
        let primaryKeyConstraint = '';
        if (primaryKeyColumns.length > 0) {
          primaryKeyConstraint = `,\nPRIMARY KEY ("${primaryKeyColumns.join('", "')}")`;
        }

        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS "${tablename}" (
            ${columnDefinitions}${primaryKeyConstraint}
          )
        `;

        // Drop table if it exists
        await targetDb.query(`DROP TABLE IF EXISTS "${tablename}" CASCADE`);
        
        // Create table
        await targetDb.query(createTableSQL);
        console.log(`Created table: ${tablename}`);
      } catch (error) {
        console.error(`Failed to create table ${tablename}:`, error.message);
        // Continue to next table
        continue;
      }
    }

    // Now migrate data for each table
    for (const { tablename } of tables) {
      console.log(`Migrating data for table: ${tablename}`);

      try {
        // Get table data
        const data = await sourceDb.query(`SELECT * FROM "${tablename}"`);
        console.log(`Found ${data.length} rows in ${tablename}`);

        // Copy data to new database
        if (data.length > 0) {
          const columns = Object.keys(data[0]);
          const quotedColumns = columns.map(col => `"${col}"`).join(', ');
          
          // Split into chunks of 50 rows to avoid query size limits
          const chunkSize = 50;
          for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            
            for (const row of chunk) {
              try {
                // Build values string for INSERT with proper escaping
                const values = columns.map(col => {
                  const val = row[col];
                  if (val === null) return 'NULL';
                  if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                  if (val instanceof Date) return `'${val.toISOString()}'`;
                  return val;
                }).join(', ');

                const insertSQL = `
                  INSERT INTO "${tablename}" (${quotedColumns})
                  VALUES (${values})
                  ON CONFLICT DO NOTHING
                `;
                
                await targetDb.query(insertSQL);
              } catch (rowError) {
                console.error(`Error inserting row in ${tablename}:`, rowError.message);
                // Continue with next row
              }
            }
            
            console.log(`Migrated ${Math.min(i + chunkSize, data.length)} of ${data.length} rows in ${tablename}`);
          }
        }
      } catch (tableError) {
        console.error(`Error migrating data for ${tablename}:`, tableError.message);
        // Continue with next table
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    console.error('Error details:', error.message);
    if (error.position) {
      console.error(`Error position: ${error.position}`);
    }
  }
}

migrateDatabase();