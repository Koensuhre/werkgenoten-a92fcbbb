
-- 1) Extend profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS company TEXT,
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS response_time TEXT,
  ADD COLUMN IF NOT EXISTS years_experience INTEGER,
  ADD COLUMN IF NOT EXISTS verified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS rating_avg NUMERIC(2,1),
  ADD COLUMN IF NOT EXISTS review_count INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_profiles_category ON public.profiles(category_id);
CREATE INDEX IF NOT EXISTS idx_profiles_primary_type ON public.profiles(primary_type);

-- 2) Categories
INSERT INTO public.categories (slug, name, description) VALUES
  ('schilderwerk','Schilderwerk','Binnen- en buitenschilders'),
  ('elektricien','Elektricien','Installatie, storingen, groepenkast'),
  ('loodgieter','Loodgieter','Lekkages, sanitair, CV'),
  ('timmerman','Timmerman','Maatwerk, kozijnen, vloeren'),
  ('dakwerker','Dakwerker','Dakbedekking en reparatie'),
  ('tuinman','Tuinman','Aanleg en onderhoud'),
  ('verhuizing','Verhuizing','Verhuisbedrijven en transport'),
  ('schoonmaak','Schoonmaak','Particulier en bedrijven')
ON CONFLICT (slug) DO NOTHING;

-- 3) Demo users, profiles, roles, jobs
DO $$
DECLARE
  cat_schilder UUID; cat_elektra UUID; cat_loodgieter UUID;
  cat_timmer UUID;   cat_dak UUID;     cat_tuin UUID;

  pro_thomas UUID := '00000000-0000-4000-a000-000000000101';
  pro_mehmet UUID := '00000000-0000-4000-a000-000000000102';
  pro_daan   UUID := '00000000-0000-4000-a000-000000000103';
  pro_eva    UUID := '00000000-0000-4000-a000-000000000104';
  pro_rik    UUID := '00000000-0000-4000-a000-000000000105';
  pro_sven   UUID := '00000000-0000-4000-a000-000000000106';

  cli_sanne  UUID := '00000000-0000-4000-a000-000000000201';
  cli_mark   UUID := '00000000-0000-4000-a000-000000000202';
  cli_aisha  UUID := '00000000-0000-4000-a000-000000000203';
  cli_pieter UUID := '00000000-0000-4000-a000-000000000204';
  cli_lisa   UUID := '00000000-0000-4000-a000-000000000205';
  cli_jeroen UUID := '00000000-0000-4000-a000-000000000206';

  demo_ids UUID[];
  uid UUID;
BEGIN
  SELECT id INTO cat_schilder  FROM public.categories WHERE slug='schilderwerk';
  SELECT id INTO cat_elektra   FROM public.categories WHERE slug='elektricien';
  SELECT id INTO cat_loodgieter FROM public.categories WHERE slug='loodgieter';
  SELECT id INTO cat_timmer    FROM public.categories WHERE slug='timmerman';
  SELECT id INTO cat_dak       FROM public.categories WHERE slug='dakwerker';
  SELECT id INTO cat_tuin      FROM public.categories WHERE slug='tuinman';

  demo_ids := ARRAY[pro_thomas,pro_mehmet,pro_daan,pro_eva,pro_rik,pro_sven,
                    cli_sanne,cli_mark,cli_aisha,cli_pieter,cli_lisa,cli_jeroen];

  -- Insert auth users (let the on_auth_user_created trigger create base profile + 'client' role)
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin)
  VALUES
    (pro_thomas,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','demo+thomas@vakwerk.local','',now(),now(),now(),'{"provider":"demo"}','{"display_name":"Thomas van Dijk"}',false),
    (pro_mehmet,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','demo+mehmet@vakwerk.local','',now(),now(),now(),'{"provider":"demo"}','{"display_name":"Mehmet Yilmaz"}',false),
    (pro_daan,  '00000000-0000-0000-0000-000000000000','authenticated','authenticated','demo+daan@vakwerk.local','',  now(),now(),now(),'{"provider":"demo"}','{"display_name":"Daan Jansen"}',false),
    (pro_eva,   '00000000-0000-0000-0000-000000000000','authenticated','authenticated','demo+eva@vakwerk.local','',   now(),now(),now(),'{"provider":"demo"}','{"display_name":"Eva Mulder"}',false),
    (pro_rik,   '00000000-0000-0000-0000-000000000000','authenticated','authenticated','demo+rik@vakwerk.local','',   now(),now(),now(),'{"provider":"demo"}','{"display_name":"Rik Bakker"}',false),
    (pro_sven,  '00000000-0000-0000-0000-000000000000','authenticated','authenticated','demo+sven@vakwerk.local','',  now(),now(),now(),'{"provider":"demo"}','{"display_name":"Sven de Vries"}',false),
    (cli_sanne, '00000000-0000-0000-0000-000000000000','authenticated','authenticated','demo+sanne@vakwerk.local','', now(),now(),now(),'{"provider":"demo"}','{"display_name":"Sanne K."}',false),
    (cli_mark,  '00000000-0000-0000-0000-000000000000','authenticated','authenticated','demo+mark@vakwerk.local','',  now(),now(),now(),'{"provider":"demo"}','{"display_name":"Mark V."}',false),
    (cli_aisha, '00000000-0000-0000-0000-000000000000','authenticated','authenticated','demo+aisha@vakwerk.local','', now(),now(),now(),'{"provider":"demo"}','{"display_name":"Aisha R."}',false),
    (cli_pieter,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','demo+pieter@vakwerk.local','',now(),now(),now(),'{"provider":"demo"}','{"display_name":"Pieter B."}',false),
    (cli_lisa,  '00000000-0000-0000-0000-000000000000','authenticated','authenticated','demo+lisa@vakwerk.local','',  now(),now(),now(),'{"provider":"demo"}','{"display_name":"Lisa H."}',false),
    (cli_jeroen,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','demo+jeroen@vakwerk.local','',now(),now(),now(),'{"provider":"demo"}','{"display_name":"Jeroen D."}',false)
  ON CONFLICT (id) DO NOTHING;

  -- Ensure profile rows exist (in case trigger didn't fire for any reason)
  FOREACH uid IN ARRAY demo_ids LOOP
    INSERT INTO public.profiles (id) VALUES (uid) ON CONFLICT (id) DO NOTHING;
  END LOOP;

  -- Update pro profiles
  UPDATE public.profiles SET display_name='Thomas van Dijk', company='Van Dijk Schilders', slug='van-dijk-schilders', primary_type='professional', city='Amsterdam', bio='Familiebedrijf met focus op kwaliteit en duurzame verfsystemen.', category_id=cat_schilder, response_time='binnen 1 uur', years_experience=12, verified=true, rating_avg=4.9, review_count=187 WHERE id=pro_thomas;
  UPDATE public.profiles SET display_name='Mehmet Yilmaz', company='Elektra B.V.', slug='elektra-bv-utrecht', primary_type='professional', city='Utrecht', bio='Gecertificeerd installateur. NEN1010 inspecties en groepenkasten.', category_id=cat_elektra, response_time='binnen 2 uur', years_experience=9, verified=true, rating_avg=4.8, review_count=243 WHERE id=pro_mehmet;
  UPDATE public.profiles SET display_name='Daan Jansen', company='24/7 Loodgieter Rotterdam', slug='loodgieter-rotterdam-24', primary_type='professional', city='Rotterdam', bio='Spoeddienst beschikbaar. Lekkages en sanitair, geen voorrijkosten in regio Rotterdam.', category_id=cat_loodgieter, response_time='binnen 30 min', years_experience=15, verified=true, rating_avg=4.7, review_count=412 WHERE id=pro_daan;
  UPDATE public.profiles SET display_name='Eva Mulder', company='Mulder Tuinwerk', slug='tuinwerk-eindhoven', primary_type='professional', city='Eindhoven', bio='Tuinarchitect en hovenier. Ontwerp tot oplevering.', category_id=cat_tuin, response_time='binnen 3 uur', years_experience=7, verified=true, rating_avg=5.0, review_count=96 WHERE id=pro_eva;
  UPDATE public.profiles SET display_name='Rik Bakker', company='Bakker Timmerwerken', slug='timmerwerk-den-haag', primary_type='professional', city='Den Haag', bio='Maatwerk meubels, kozijnen en vloeren. Eigen werkplaats.', category_id=cat_timmer, response_time='binnen 4 uur', years_experience=18, verified=true, rating_avg=4.9, review_count=154 WHERE id=pro_rik;
  UPDATE public.profiles SET display_name='Sven de Vries', company='Dakdekkers Noord', slug='dakdekkers-noord', primary_type='professional', city='Groningen', bio='EPDM, bitumen en pannendaken. 10 jaar garantie.', category_id=cat_dak, response_time='binnen 1 dag', years_experience=11, verified=false, rating_avg=4.7, review_count=78 WHERE id=pro_sven;

  -- Update client profiles
  UPDATE public.profiles SET display_name='Sanne K.', city='Amsterdam' WHERE id=cli_sanne;
  UPDATE public.profiles SET display_name='Mark V.', city='Utrecht' WHERE id=cli_mark;
  UPDATE public.profiles SET display_name='Aisha R.', city='Rotterdam' WHERE id=cli_aisha;
  UPDATE public.profiles SET display_name='Pieter B.', city='Den Haag' WHERE id=cli_pieter;
  UPDATE public.profiles SET display_name='Lisa H.', city='Eindhoven' WHERE id=cli_lisa;
  UPDATE public.profiles SET display_name='Jeroen D.', city='Groningen' WHERE id=cli_jeroen;

  -- Pro role (in addition to default 'client')
  INSERT INTO public.user_roles (user_id, role) VALUES
    (pro_thomas,'professional'),(pro_mehmet,'professional'),(pro_daan,'professional'),
    (pro_eva,'professional'),(pro_rik,'professional'),(pro_sven,'professional')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Jobs
  INSERT INTO public.jobs (client_id, slug, title, description, category_id, city, budget_min, budget_max, urgent, status, created_at) VALUES
    (cli_sanne,'schilderen-woonkamer-amsterdam','Woonkamer schilderen (35m²)','Woonkamer van 35m² inclusief plafond. Witte muren, één accentmuur. Plinten en kozijnen ook lakken.',cat_schilder,'Amsterdam',600,900,true,'open',now() - interval '2 hours'),
    (cli_mark,'groepenkast-vervangen-utrecht','Groepenkast vervangen incl. aardlekschakelaars','Bestaande groepenkast uit 1998. Vervangen door moderne kast met 3 aardlekschakelaars conform NEN1010.',cat_elektra,'Utrecht',800,1200,false,'open',now() - interval '5 hours'),
    (cli_aisha,'lekkage-badkamer-rotterdam','Lekkage opsporen badkamer','Plafond onder badkamer vertoont vochtplek. Lekkage opsporen en herstellen.',cat_loodgieter,'Rotterdam',150,350,true,'open',now() - interval '1 day'),
    (cli_pieter,'houten-vloer-leggen-den-haag','Eikenhouten vloer leggen 60m²','Massief eiken vloer leggen op betonnen ondervloer. Inclusief plinten.',cat_timmer,'Den Haag',2500,3500,false,'open',now() - interval '1 day'),
    (cli_lisa,'tuinaanleg-eindhoven','Compleet tuinontwerp en aanleg 120m²','Achtertuin van 120m². Bestrating, vlonder, beplanting en verlichting.',cat_tuin,'Eindhoven',4000,7000,false,'open',now() - interval '3 days'),
    (cli_jeroen,'dakgoot-reparatie-groningen','Dakgoot reparatie en reiniging','Dakgoot lekt op één hoek. Reparatie en volledige reiniging.',cat_dak,'Groningen',200,450,false,'open',now() - interval '4 days')
  ON CONFLICT (slug) DO NOTHING;
END $$;
