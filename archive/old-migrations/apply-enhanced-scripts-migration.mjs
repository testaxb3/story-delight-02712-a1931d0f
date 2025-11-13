import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

// Database connection from .env.local
const client = new Client({
  connectionString: 'postgresql://postgres:X0TsG9oqZePePuaA@db.iogceaotdodvugrmogpp.supabase.co:5432/postgres',
});

async function applyMigration() {
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Read migration file
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20251114000000_enhance_scripts_structure.sql');
    console.log('📄 Reading migration file:', migrationPath);

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('✅ Migration file loaded\n');

    console.log('🚀 Applying migration...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Execute migration
    await client.query(migrationSQL);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Migration applied successfully!\n');

    // Verify new columns exist
    console.log('🔍 Verifying new columns...');
    const verifyQuery = `
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'scripts'
        AND column_name IN (
          'situation_trigger',
          'location_type',
          'time_optimal',
          'intensity_level',
          'success_speed',
          'parent_state',
          'age_min',
          'age_max',
          'backup_plan',
          'common_mistakes',
          'pause_after_phrase_1',
          'pause_after_phrase_2',
          'expected_time_seconds',
          'related_script_ids',
          'difficulty_level',
          'requires_preparation',
          'works_in_public',
          'emergency_suitable'
        )
      ORDER BY column_name;
    `;

    const result = await client.query(verifyQuery);

    if (result.rows.length === 18) {
      console.log(`✅ All 18 new columns verified!\n`);
      console.log('New columns:');
      result.rows.forEach(row => {
        console.log(`  - ${row.column_name} (${row.data_type})`);
      });
    } else {
      console.log(`⚠️  Expected 18 columns, found ${result.rows.length}`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Enhanced Scripts structure is ready!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📋 Next steps:');
    console.log('1. Create scripts using the 3 agents');
    console.log('2. Test SOS Mode by searching "emergency"');
    console.log('3. Verify Enhanced Script Cards show context\n');

  } catch (error) {
    console.error('❌ Error applying migration:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

applyMigration();
