#!/usr/bin/env node

/**
 * Get Table Schemas - Query actual column definitions from database
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iogceaotdodvugrmogpp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODcwODQsImV4cCI6MjA3NjQ2MzA4NH0.uMAT-RZLc0jh1E03UiDrQ1gnpxfZulZ16OxQpypAGJo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getTableSchema(tableName) {
  console.log(`\nGetting schema for: ${tableName}`);

  // Try to insert and capture the error to see column structure
  const { error } = await supabase
    .from(tableName)
    .insert({});

  if (error) {
    console.log(`Error details for ${tableName}:`, error);
  }

  // Try to select with all possible columns
  const { data, error: selectError } = await supabase
    .from(tableName)
    .select('*')
    .limit(1);

  if (selectError) {
    console.log(`Select error for ${tableName}:`, selectError);
  }

  return { data, error, selectError };
}

async function getSchemaViaTypes() {
  console.log('\n=== Checking TypeScript types file ===\n');

  const fs = await import('fs');
  const path = await import('path');

  const typesPath = path.join(process.cwd(), 'src/integrations/supabase/types.ts');

  try {
    const content = fs.readFileSync(typesPath, 'utf-8');
    console.log('Types file exists!');

    // Extract table definitions
    const tables = {};

    // Look for interface definitions
    const interfaceRegex = /export interface (\w+) \{([^}]+)\}/gs;
    let match;

    while ((match = interfaceRegex.exec(content)) !== null) {
      const tableName = match[1];
      const fields = match[2];
      tables[tableName] = fields.trim();
    }

    return { content, tables };
  } catch (e) {
    console.error('Error reading types file:', e.message);
    return null;
  }
}

async function inspectEmptyTables() {
  console.log('\n=== INSPECTING EMPTY TABLES ===\n');

  const emptyTables = [
    'scripts_usage',
    'script_feedback',
    'posts',
    'comments',
    'reactions',
    'user_bonuses',
    'notifications',
    'badges',
    'user_badges'
  ];

  const schemas = {};

  for (const table of emptyTables) {
    // Try to get error message which often reveals column names
    const { error } = await supabase
      .from(table)
      .insert({ __fake_column__: 'test' });

    if (error) {
      console.log(`\n${table}:`);
      console.log(`  Error: ${error.message}`);
      console.log(`  Code: ${error.code}`);
      console.log(`  Details: ${JSON.stringify(error.details)}`);

      schemas[table] = {
        error: error.message,
        code: error.code,
        details: error.details
      };
    }

    // Try to select and see what happens
    const { data, error: selectError } = await supabase
      .from(table)
      .select('*')
      .limit(1);

    if (selectError) {
      console.log(`  Select Error: ${selectError.message}`);
      schemas[table].selectError = selectError.message;
    } else {
      console.log(`  ✓ Table is accessible (${data?.length || 0} rows)`);
    }
  }

  return schemas;
}

async function main() {
  console.log('='.repeat(80));
  console.log('TABLE SCHEMA INSPECTOR');
  console.log('='.repeat(80));

  // Get TypeScript types
  const types = await getSchemaViaTypes();

  if (types) {
    console.log('\nFound table definitions in types file:');
    console.log(Object.keys(types.tables).join(', '));
  }

  // Inspect empty tables
  const schemas = await inspectEmptyTables();

  // Save results
  const fs = await import('fs');
  const path = await import('path');

  const outputPath = path.join(process.cwd(), 'table-schemas-report.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    schemas,
    types: types?.tables || {}
  }, null, 2));

  console.log(`\n\n✓ Report saved to: ${outputPath}`);
}

main().catch(console.error);
