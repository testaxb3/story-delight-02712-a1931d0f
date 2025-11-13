#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env') });

const results = [];

const logResult = (label, status, message) => {
  results.push({ label, status, message });
};

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_URL.trim()) {
  logResult(
    'Supabase URL',
    'fail',
    'VITE_SUPABASE_URL ausente. Adicione a URL do projeto ao arquivo .env.'
  );
} else {
  logResult('Supabase URL', 'pass', 'VITE_SUPABASE_URL encontrado.');
}

if (!SUPABASE_ANON_KEY || !SUPABASE_ANON_KEY.trim()) {
  logResult(
    'Chave pública',
    'fail',
    'VITE_SUPABASE_PUBLISHABLE_KEY ausente. Cole a chave "anon" do projeto no arquivo .env.'
  );
} else {
  logResult('Chave pública', 'pass', 'VITE_SUPABASE_PUBLISHABLE_KEY encontrada.');
}

const hasBasicConfig = SUPABASE_URL.trim().length > 0 && SUPABASE_ANON_KEY.trim().length > 0;

if (!hasBasicConfig) {
  printReport();
  process.exit(1);
}

const publicClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  },
});

try {
  const { error } = await publicClient.auth.getSession();
  if (error) {
    logResult(
      'Conexão pública',
      'fail',
      `Falha ao validar a conexão com Supabase: ${error.message}`
    );
  } else {
    logResult('Conexão pública', 'pass', 'Cliente público conecta com sucesso.');
  }
} catch (error) {
  logResult(
    'Conexão pública',
    'fail',
    `Erro ao contactar Supabase: ${error.message}`
  );
}

if (!SUPABASE_SERVICE_KEY) {
  logResult(
    'Chave service role',
    'warn',
    'SUPABASE_SERVICE_ROLE_KEY não configurada. Sem ela não é possível validar tabelas automaticamente.'
  );
  printReport();
  process.exit(0);
}

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

const requiredTables = [
  'profiles',
  'user_progress',
  'tracker_days',
  'scripts',
  'videos',
  'pdfs',
];

for (const table of requiredTables) {
  try {
    const { error } = await adminClient.from(table).select('id', { head: true, count: 'exact' });
    if (error) {
      logResult(
        `Tabela ${table}`,
        'fail',
        `Não foi possível consultar ${table}: ${error.message}`
      );
    } else {
      logResult(
        `Tabela ${table}`,
        'pass',
        `${table} disponível no banco.`
      );
    }
  } catch (error) {
    logResult(
      `Tabela ${table}`,
      'fail',
      `Erro ao validar ${table}: ${error.message}`
    );
  }
}

try {
  const { error } = await adminClient.rpc('save_child_profile', {
    child_name: null,
    child_profile: null,
    quiz_completed: false,
    parent_name: null,
    email: null,
  });

  if (error) {
    logResult(
      'Função save_child_profile',
      'fail',
      `Função ausente ou com erro: ${error.message}`
    );
  } else {
    logResult('Função save_child_profile', 'pass', 'Função RPC encontrada.');
  }
} catch (error) {
  logResult(
    'Função save_child_profile',
    'fail',
    `Erro ao validar função: ${error.message}`
  );
}

printReport();

function printReport() {
  const statusEmoji = {
    pass: '✅',
    fail: '❌',
    warn: '⚠️',
  };

  console.log('\nDiagnóstico Supabase');
  console.log('====================');

  for (const item of results) {
    const emoji = statusEmoji[item.status] ?? '•';
    console.log(`${emoji} ${item.label}: ${item.message}`);
  }
  console.log('');
}
