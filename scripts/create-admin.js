// Script to create an admin user in the database
const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcrypt');

// Database connection
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_kB0yUrqcg6pd@ep-black-glade-a46muedm-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

// User details
const email = 'babak@ymail.com';
const password = 'saddam55555';
const name = 'Admin User';
const role = 'admin';

async function createAdminUser() {
  try {
    console.log(`Creating admin user with email: ${email}`);
    
    // Check if user already exists
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
    
    if (existingUser.length > 0) {
      console.log('User already exists. Updating password...');
      
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Update the existing user
      await sql`
        UPDATE users 
        SET password = ${hashedPassword}, role = ${role}
        WHERE email = ${email}
      `;
      
      console.log('User updated successfully!');
    } else {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Insert the new user
      await sql`
        INSERT INTO users (name, email, password, role) 
        VALUES (${name}, ${email}, ${hashedPassword}, ${role})
      `;
      
      console.log('Admin user created successfully!');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Execute the function
createAdminUser();
