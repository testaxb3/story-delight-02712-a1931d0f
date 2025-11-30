-- Backfill phone numbers from webhook_data for existing records
UPDATE approved_users 
SET phone = COALESCE(
  webhook_data->'order'->'customer'->>'phone',
  webhook_data->'order'->'address'->>'phone',
  webhook_data->'order'->'billing_address'->>'phone',
  webhook_data->'order'->'shipping_address'->>'phone'
)
WHERE phone IS NULL 
AND webhook_data IS NOT NULL
AND COALESCE(
  webhook_data->'order'->'customer'->>'phone',
  webhook_data->'order'->'address'->>'phone',
  webhook_data->'order'->'billing_address'->>'phone',
  webhook_data->'order'->'shipping_address'->>'phone'
) IS NOT NULL;