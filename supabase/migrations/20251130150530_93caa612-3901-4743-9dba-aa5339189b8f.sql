
INSERT INTO approved_users (email, first_name, last_name, order_id, product_name, status, approved_at, account_created)
VALUES 
  ('tcwasserbach@outlook.com', 'Teri', 'Wasserbach', '#31', 'The Obedience Language', 'active', now(), false),
  ('dshapiro@esncc.com', 'Daniel', 'Shapiro', '#30', 'The Obedience Language', 'active', now(), false),
  ('michelle.e.harris75@gmail.com', 'Michelle', 'Witten', '#29', 'The Obedience Language', 'active', now(), false),
  ('thorngg@gmail.com', 'Gailyn', 'Thornton', '#28', 'The Obedience Language', 'active', now(), false),
  ('francineslagle@gmail.com', 'Francine', 'Slagle', '#27', 'The Obedience Language', 'active', now(), false),
  ('njstacy@msn.com', 'Nancy', 'Stacy', '#26', 'The Obedience Language', 'active', now(), false),
  ('maureendaloia82@gmail.com', 'Maureen', 'Daloia', '#25', 'The Obedience Language', 'active', now(), false),
  ('mdtr14@gmail.com', 'Mary', 'Reyes', '#24', 'The Obedience Language', 'active', now(), false),
  ('sherriconley55@gmail.com', 'Sherri', 'Conley', '#23', 'The Obedience Language', 'active', now(), false)
ON CONFLICT (email) DO UPDATE SET status = 'active', updated_at = now();
