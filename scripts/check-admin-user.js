#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Script to check admin user and create if it doesn't exist
const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Dl5GucfaZYS9@ep-frosty-boat-abcvz7ro-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

async function checkAndCreateAdminUser() {
  const adminUserId = process.env.ADMIN_USER_ID;
  
  if (!adminUserId) {
    console.log('❌ ADMIN_USER_ID environment variable not set');
    return false;
  }
  
  try {
    // Check if admin user exists
    const existingUser = await sql`
      SELECT id, name, email FROM users WHERE id = ${parseInt(adminUserId)}
    `;
    
    if (existingUser.length > 0) {
      console.log('✅ Admin user found:');
      console.log(`   ID: ${existingUser[0].id}`);
      console.log(`   Name: ${existingUser[0].name}`);
      console.log(`   Email: ${existingUser[0].email}`);
      return true;
    }
    
    // Admin user doesn't exist, let's see what users do exist
    console.log('❌ Admin user not found. Checking existing users...');
    
    const allUsers = await sql`SELECT id, name, email FROM users ORDER BY id`;
    
    if (allUsers.length === 0) {
      console.log('No users found in database. You may need to create an admin user first.');
      console.log('Consider using the admin creation script or registering through the web interface.');
    } else {
      console.log('Existing users:');
      allUsers.forEach(user => {
        console.log(`   ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
      });
      console.log(`\nTo set a user as admin, update ADMIN_USER_ID in .env.local to one of the IDs above.`);
    }
    
    return false;
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    return false;
  }
}

// Run the check
checkAndCreateAdminUser().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});
