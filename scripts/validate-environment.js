#!/usr/bin/env node

// Validation script for environment setup
const { validateConfig, validateAPIKeys, validateAdminUser } = require('./lib/config.ts')

async function runValidation() {
  console.log('🔍 Validating environment setup...\n')
  
  let allChecksPass = true
  
  // 1. Validate configuration
  console.log('1. Checking environment variables...')
  try {
    validateConfig()
    console.log('   ✅ All required environment variables are set')
  } catch (error) {
    console.log('   ❌ Configuration validation failed:')
    console.log('     ', error.message)
    allChecksPass = false
  }
  
  // 2. Validate API keys
  console.log('\n2. Testing API key validity...')
  try {
    const apiResults = await validateAPIKeys()
    
    if (apiResults.exa) {
      console.log('   ✅ Exa API key is valid')
    } else {
      console.log('   ❌ Exa API key validation failed')
      allChecksPass = false
    }
    
    if (apiResults.googleAI) {
      console.log('   ✅ Google AI API key is valid')
    } else {
      console.log('   ❌ Google AI API key validation failed')
      allChecksPass = false
    }
  } catch (error) {
    console.log('   ❌ API key validation failed:', error.message)
    allChecksPass = false
  }
  
  // 3. Validate admin user
  console.log('\n3. Checking admin user in database...')
  try {
    const adminUserExists = await validateAdminUser()
    
    if (adminUserExists) {
      console.log('   ✅ Admin user exists in database')
    } else {
      console.log('   ❌ Admin user not found in database')
      allChecksPass = false
    }
  } catch (error) {
    console.log('   ❌ Admin user validation failed:', error.message)
    allChecksPass = false
  }
  
  // Final result
  console.log('\n' + '='.repeat(50))
  if (allChecksPass) {
    console.log('🎉 All environment setup checks passed!')
    console.log('Your news scraping system is ready to use.')
  } else {
    console.log('⚠️  Some environment setup checks failed.')
    console.log('Please review the errors above and fix them before proceeding.')
    process.exit(1)
  }
  console.log('='.repeat(50))
}

// Run the validation
runValidation().catch(console.error)
