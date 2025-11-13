#!/usr/bin/env node

/**
 * Database Audit Script
 * Connects to the ACTUAL Supabase database and retrieves complete schema information
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iogceaotdodvugrmogpp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODcwODQsImV4cCI6MjA3NjQ2MzA4NH0.uMAT-RZLc0jh1E03UiDrQ1gnpxfZulZ16OxQpypAGJo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function querySchema(query) {
  const { data, error } = await supabase.rpc('exec_sql', { sql: query });
  if (error) {
    // If exec_sql doesn't exist, try direct query
    const { data: directData, error: directError } = await supabase
      .from('pg_catalog.pg_tables')
      .select('*');

    if (directError) {
      console.error('Error querying schema:', directError);
      return null;
    }
    return directData;
  }
  return data;
}

async function getAllTables() {
  console.log('\n=== QUERYING ALL TABLES ===\n');

  // Query using information_schema
  const { data, error } = await supabase
    .from('information_schema.tables')
    .select('*')
    .eq('table_schema', 'public');

  if (error) {
    console.error('Error getting tables:', error);
    // Try alternative method
    const query = `
      SELECT
        table_name,
        table_type
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ query })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Tables found:', result);
        return result;
      }
    } catch (e) {
      console.error('Alternative method failed:', e);
    }

    return null;
  }

  console.log('Tables found:', data?.length || 0);
  return data;
}

async function getTableColumns(tableName) {
  console.log(`\n=== Getting columns for ${tableName} ===\n`);

  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(0);

  if (error) {
    console.error(`Error accessing ${tableName}:`, error);
    return null;
  }

  // Get column info from information schema
  const { data: columns, error: colError } = await supabase
    .from('information_schema.columns')
    .select('*')
    .eq('table_name', tableName)
    .eq('table_schema', 'public');

  if (colError) {
    console.error(`Error getting columns for ${tableName}:`, colError);
  }

  return columns;
}

async function testTableAccess() {
  console.log('\n=== TESTING TABLE ACCESS ===\n');

  const testTables = [
    'profiles',
    'scripts',
    'tracker_days',
    'scripts_usage',
    'script_feedback',
    'posts',
    'comments',
    'reactions',
    'bonuses',
    'user_bonuses',
    'notifications',
    'badges',
    'user_badges'
  ];

  const results = {};

  for (const table of testTables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        results[table] = {
          exists: false,
          error: error.message,
          code: error.code
        };
      } else {
        results[table] = {
          exists: true,
          count: count || 0
        };

        // Get actual structure
        const { data: sample } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (sample && sample.length > 0) {
          results[table].columns = Object.keys(sample[0]);
        } else {
          results[table].columns = [];
        }
      }
    } catch (e) {
      results[table] = {
        exists: false,
        error: e.message
      };
    }
  }

  return results;
}

async function getRLSPolicies() {
  console.log('\n=== GETTING RLS POLICIES ===\n');

  try {
    const { data, error } = await supabase
      .from('pg_policies')
      .select('*');

    if (error) {
      console.error('Error getting RLS policies:', error);
    } else {
      console.log('RLS Policies found:', data?.length || 0);
      return data;
    }
  } catch (e) {
    console.error('Exception getting RLS policies:', e);
  }

  return null;
}

async function getViews() {
  console.log('\n=== GETTING VIEWS ===\n');

  try {
    const { data, error } = await supabase
      .from('information_schema.views')
      .select('*')
      .eq('table_schema', 'public');

    if (error) {
      console.error('Error getting views:', error);
    } else {
      console.log('Views found:', data?.length || 0);
      return data;
    }
  } catch (e) {
    console.error('Exception getting views:', e);
  }

  return null;
}

async function getFunctions() {
  console.log('\n=== GETTING FUNCTIONS ===\n');

  try {
    const { data, error } = await supabase
      .from('pg_proc')
      .select('*');

    if (error) {
      console.error('Error getting functions:', error);
    } else {
      console.log('Functions found:', data?.length || 0);
      return data;
    }
  } catch (e) {
    console.error('Exception getting functions:', e);
  }

  return null;
}

async function main() {
  console.log('='.repeat(80));
  console.log('BRAINY CHILD GUIDE - DATABASE AUDIT');
  console.log('='.repeat(80));
  console.log(`\nConnecting to: ${SUPABASE_URL}`);
  console.log('Database: iogceaotdodvugrmogpp\n');

  // Test basic connection
  const { data: connectionTest, error: connectionError } = await supabase
    .from('profiles')
    .select('count', { count: 'exact', head: true });

  if (connectionError) {
    console.error('CONNECTION FAILED:', connectionError);
    process.exit(1);
  }

  console.log('✓ Connection successful\n');

  // Test all tables
  const tableResults = await testTableAccess();

  console.log('\n=== TABLE ACCESS RESULTS ===\n');
  console.log(JSON.stringify(tableResults, null, 2));

  // Get views
  const views = await getViews();

  // Generate report
  console.log('\n\n=== FINAL REPORT ===\n');

  console.log('TABLES THAT EXIST:');
  Object.entries(tableResults)
    .filter(([_, info]) => info.exists)
    .forEach(([table, info]) => {
      console.log(`  ✓ ${table} (${info.count} rows)`);
      if (info.columns && info.columns.length > 0) {
        console.log(`    Columns: ${info.columns.join(', ')}`);
      }
    });

  console.log('\n\nTABLES THAT DO NOT EXIST:');
  Object.entries(tableResults)
    .filter(([_, info]) => !info.exists)
    .forEach(([table, info]) => {
      console.log(`  ✗ ${table}`);
      console.log(`    Error: ${info.error}`);
      console.log(`    Code: ${info.code}`);
    });

  console.log('\n\nVIEWS:');
  if (views && views.length > 0) {
    views.forEach(view => {
      console.log(`  - ${view.table_name}`);
    });
  } else {
    console.log('  (Unable to retrieve views)');
  }

  // Save to file
  const report = {
    timestamp: new Date().toISOString(),
    database: 'iogceaotdodvugrmogpp',
    url: SUPABASE_URL,
    tables: tableResults,
    views: views || [],
    summary: {
      tablesExist: Object.values(tableResults).filter(t => t.exists).length,
      tablesMissing: Object.values(tableResults).filter(t => !t.exists).length,
      totalViews: views?.length || 0
    }
  };

  const fs = await import('fs');
  const path = await import('path');

  const outputPath = path.join(process.cwd(), 'database-audit-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

  console.log(`\n\n✓ Full report saved to: ${outputPath}`);
  console.log('\n' + '='.repeat(80));
}

main().catch(console.error);
