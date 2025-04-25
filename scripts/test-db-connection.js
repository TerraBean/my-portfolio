const { neon } = require('@neondatabase/serverless');

// New database connection string
const dbUrl = 'postgresql://neondb_owner:npg_Dl5GucfaZYS9@ep-frosty-boat-abcvz7ro-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require';
const sql = neon(dbUrl);

async function testConnection() {
  try {
    console.log('Attempting to connect to the new database...');
    
    // Check if tables exist
    const tables = await sql`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `;
    
    console.log('Tables in the database:');
    tables.forEach(table => {
      console.log(`- ${table.tablename}`);
    });
    
    // Check users table structure
    console.log('\nUsers table structure:');
    const usersColumns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND table_schema = 'public'
    `;
    
    if (usersColumns.length === 0) {
      console.log('Users table not found or has no columns');
    } else {
      usersColumns.forEach(col => {
        console.log(`- ${col.column_name} (${col.data_type})`);
      });
    }
    
    // Check blog_posts table structure
    console.log('\nBlog posts table structure:');
    const postsColumns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'blog_posts'
      AND table_schema = 'public'
    `;
    
    if (postsColumns.length === 0) {
      console.log('Blog posts table not found or has no columns');
    } else {
      postsColumns.forEach(col => {
        console.log(`- ${col.column_name} (${col.data_type})`);
      });
    }
    
    // Try to get users without the role column
    console.log('\nUsers in the database:');
    const users = await sql`SELECT id, name, email FROM users`;
    if (users.length === 0) {
      console.log('No users found');
    } else {
      users.forEach(user => {
        console.log(`- ${user.name} (${user.email})`);
      });
    }
    
    // Try to get blog posts
    console.log('\nBlog posts in the database:');
    const posts = await sql`SELECT id, title, slug FROM blog_posts`;
    if (posts.length === 0) {
      console.log('No blog posts found');
    } else {
      posts.forEach(post => {
        console.log(`- ${post.title} (${post.slug})`);
      });
    }
    
    console.log('\nDatabase connection test completed!');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

testConnection();
