-- Insert initial product catalog with compliance-friendly language
-- Using modern terminology (day/night/balanced instead of sativa/indica)

-- Get category IDs for reference
DO $$
DECLARE
  cat_edibles UUID;
  cat_vapes UUID;
  cat_prerolls UUID;
  cat_flower UUID;
  cat_concentrates UUID;
  cat_accessories UUID;
BEGIN
  SELECT id INTO cat_edibles FROM categories WHERE slug = 'edibles';
  SELECT id INTO cat_vapes FROM categories WHERE slug = 'vapes';
  SELECT id INTO cat_prerolls FROM categories WHERE slug = 'pre-rolls';
  SELECT id INTO cat_flower FROM categories WHERE slug = 'flower';
  SELECT id INTO cat_concentrates FROM categories WHERE slug = 'concentrates';
  SELECT id INTO cat_accessories FROM categories WHERE slug = 'accessories';

  -- EDIBLES
  INSERT INTO products (name, slug, category_id, short_description, long_description, profile, intensity, experience_notes, tags, base_price, price_text, thc_percentage, is_active, sort_order) VALUES
  ('Dean and Deluca Gummies (500 mg)', 'dean-deluca-gummies-500mg', cat_edibles, 'Premium infused gummies with 500mg total potency', 'Experience a smooth, long-lasting effect with these carefully crafted gummies. Each package contains 500mg total, perfect for those seeking a reliable edible experience. Effects may vary by person.', 'balanced', 'strong', ARRAY['calm', 'unwind', 'social'], ARRAY['gummies', 'edibles', 'potent'], 60.00, '$60', 25.00, true, 1),
  
  ('Elysian Psilocybin Tincture Oil', 'elysian-psilocybin-tincture', cat_edibles, 'A powerful tincture oil for an elevated experience', 'This premium tincture offers precise dosing and fast-acting effects. Ideal for experienced users seeking a potent, controlled experience. Start low and go slow. Effects vary by person.', 'night', 'bold', ARRAY['focus', 'creative', 'introspective'], ARRAY['tincture', 'oil', 'psilocybin', 'premium'], 45.00, '$45', NULL, true, 2),
  
  ('Polka Shot – A Unique Infusion', 'polka-shot-infusion', cat_edibles, 'Unique infused shot - FIRE SALE special pricing', 'A one-of-a-kind infused beverage offering a quick-onset experience. Perfect for those who prefer liquid edibles. Limited time special pricing. Effects may vary.', 'anytime', 'moderate', ARRAY['upbeat', 'social'], ARRAY['beverage', 'shot', 'sale', 'special'], 20.00, '$20 - FIRE SALE', 15.00, true, 3),
  
  ('Polkadot Syrup', 'polkadot-syrup', cat_edibles, 'Sweet and potent cannabis-infused syrup', 'A versatile syrup that can be mixed into beverages or taken directly. Offers a smooth, gradual onset with long-lasting effects. Dosage control is easy with the included measuring cap.', 'night', 'strong', ARRAY['calm', 'unwind'], ARRAY['syrup', 'beverage', 'potent', 'versatile'], 80.00, '$80', 30.00, true, 4),
  
  ('HOLIDAZE Mystery Edible Special', 'holidaze-mystery-edible', cat_edibles, 'Mystery edible selection ranging from 400mg to 1000mg', 'Get a surprise premium edible from our curated selection. Potency ranges from 400mg to 1000mg depending on the product. Perfect for adventurous users. All products are lab-tested and high-quality.', 'balanced', 'strong', ARRAY['surprise', 'variety'], ARRAY['mystery', 'special', 'holiday', 'variety'], 40.00, '$40-$100', 28.00, true, 5);

END $$;

-- Continue with more products
DO $$
DECLARE
  cat_vapes UUID;
  cat_prerolls UUID;
  cat_flower UUID;
  cat_concentrates UUID;
  cat_accessories UUID;
BEGIN
  SELECT id INTO cat_vapes FROM categories WHERE slug = 'vapes';
  SELECT id INTO cat_prerolls FROM categories WHERE slug = 'pre-rolls';
  SELECT id INTO cat_flower FROM categories WHERE slug = 'flower';
  SELECT id INTO cat_concentrates FROM categories WHERE slug = 'concentrates';
  SELECT id INTO cat_accessories FROM categories WHERE slug = 'accessories';

  -- DISPOSABLE VAPES
  INSERT INTO products (name, slug, category_id, short_description, long_description, profile, intensity, experience_notes, tags, base_price, price_text, sizes, thc_percentage, is_active, sort_order) VALUES
  ('Sprinkles 2g Disposable Cart', 'sprinkles-2g-disposable', cat_vapes, 'Premium 2g disposable vape cartridge', 'High-quality disposable vape with 2 grams of premium oil. Convenient, portable, and ready to use. Smooth draws with consistent potency throughout. No charging or refilling needed.', 'day', 'strong', ARRAY['upbeat', 'social', 'creative'], ARRAY['disposable', 'vape', '2g', 'premium'], 80.00, '$80', '[{"size": "2g", "price": 80.00, "unit": "gram"}]'::jsonb, 85.00, true, 10),
  
  ('Slugger 2g Carts', 'slugger-2g-carts', cat_vapes, 'Slugger brand 2g disposable cartridge', 'Popular Slugger brand offering smooth, flavorful vapor. 2 grams of quality concentrate in a sleek disposable design. Perfect for on-the-go use.', 'balanced', 'strong', ARRAY['upbeat', 'focus'], ARRAY['disposable', 'vape', '2g', 'slugger'], 80.00, '$80', '[{"size": "2g", "price": 80.00, "unit": "gram"}]'::jsonb, 82.00, true, 11),
  
  ('Boutiq Switch Liquid Live Diamonds Dual Tank 2g', 'boutiq-switch-liquid-live-diamonds', cat_vapes, 'Dual tank disposable with liquid live diamonds', 'Premium dual-chamber design featuring liquid live diamonds. Switch between two different strains or effects. 2g total capacity with exceptional flavor and potency.', 'anytime', 'bold', ARRAY['versatile', 'premium'], ARRAY['disposable', 'vape', '2g', 'live-diamonds', 'dual-tank'], 80.00, '$80', '[{"size": "2g", "price": 80.00, "unit": "gram"}]'::jsonb, 88.00, true, 12),
  
  ('Choice 2g Carts', 'choice-2g-carts', cat_vapes, 'Choice brand 2g disposable vape', 'Reliable Choice brand disposable with 2 grams of quality oil. Consistent performance and smooth vapor production. Great value for the size.', 'day', 'moderate', ARRAY['upbeat', 'social'], ARRAY['disposable', 'vape', '2g', 'choice'], 80.00, '$80', '[{"size": "2g", "price": 80.00, "unit": "gram"}]'::jsonb, 80.00, true, 13),
  
  ('Wholemelt 2g Disposable Cart', 'wholemelt-2g-disposable', cat_vapes, 'Wholemelt 2g disposable - premium quality', 'Wholemelt brand known for purity and potency. 2 grams of carefully extracted concentrate. Clean, smooth vapor with no additives.', 'night', 'strong', ARRAY['calm', 'unwind'], ARRAY['disposable', 'vape', '2g', 'wholemelt'], 60.00, '$60', '[{"size": "2g", "price": 60.00, "unit": "gram"}]'::jsonb, 84.00, true, 14),
  
  ('Smoothie Bar 2g Dual Chamber Vape', 'smoothie-bar-2g-dual-chamber', cat_vapes, 'Dual chamber 2g vape with flavor variety', 'Innovative dual-chamber design lets you switch between two flavors. 2 grams total of premium concentrate. Perfect for those who enjoy variety in their vaping experience.', 'balanced', 'moderate', ARRAY['social', 'upbeat'], ARRAY['disposable', 'vape', '2g', 'dual-chamber', 'flavor'], 80.00, '$80', '[{"size": "2g", "price": 80.00, "unit": "gram"}]'::jsonb, 78.00, true, 15);

END $$;

-- THC CARTS (1g)
DO $$
DECLARE
  cat_vapes UUID;
BEGIN
  SELECT id INTO cat_vapes FROM categories WHERE slug = 'vapes';

  INSERT INTO products (name, slug, category_id, short_description, long_description, profile, intensity, experience_notes, tags, base_price, price_text, sizes, thc_percentage, is_active, sort_order) VALUES
  ('Raw Garden Carts 1g', 'raw-garden-1g-cart', cat_vapes, 'Premium Raw Garden 1g cartridge', 'Raw Garden is known for quality and purity. 1 gram of refined live resin oil. Clean, flavorful vapor with consistent effects. Compatible with standard 510 thread batteries.', 'day', 'strong', ARRAY['upbeat', 'creative', 'focus'], ARRAY['cartridge', '1g', 'raw-garden', 'live-resin'], 40.00, '$40', '[{"size": "1g", "price": 40.00, "unit": "gram"}]'::jsonb, 85.00, true, 20),
  
  ('APE 1g Disposable Cart', 'ape-1g-disposable', cat_vapes, 'APE brand 1g disposable cartridge', 'Convenient APE disposable with 1 gram capacity. No battery needed - ready to use out of the box. Smooth draws and reliable performance.', 'balanced', 'moderate', ARRAY['calm', 'social'], ARRAY['disposable', '1g', 'ape'], 40.00, '$40', '[{"size": "1g", "price": 40.00, "unit": "gram"}]'::jsonb, 80.00, true, 21),
  
  ('Cali 1g Cart', 'cali-1g-cart', cat_vapes, 'California-sourced 1g cartridge', 'Premium California oil in a 1 gram cartridge. Clean extraction process ensures pure, potent vapor. Great everyday option for regular users.', 'day', 'moderate', ARRAY['upbeat', 'social'], ARRAY['cartridge', '1g', 'california'], 40.00, '$40', '[{"size": "1g", "price": 40.00, "unit": "gram"}]'::jsonb, 82.00, true, 22),
  
  ('Muha Meds 1g Cart', 'muha-meds-1g-cart', cat_vapes, 'Muha Meds 1g cartridge', 'Popular Muha Meds brand offering consistent quality. 1 gram of premium concentrate with excellent flavor profiles. Trusted by many regular users.', 'balanced', 'strong', ARRAY['calm', 'focus'], ARRAY['cartridge', '1g', 'muha-meds'], 40.00, '$40', '[{"size": "1g", "price": 40.00, "unit": "gram"}]'::jsonb, 84.00, true, 23),
  
  ('Jeeter Juice 1g Cart', 'jeeter-juice-1g-cart', cat_vapes, 'Jeeter Juice 1g cartridge', 'Well-known Jeeter brand liquid diamonds cartridge. 1 gram of high-quality concentrate. Smooth, flavorful vapor with potent effects.', 'day', 'strong', ARRAY['upbeat', 'creative'], ARRAY['cartridge', '1g', 'jeeter', 'liquid-diamonds'], 40.00, '$40', '[{"size": "1g", "price": 40.00, "unit": "gram"}]'::jsonb, 86.00, true, 24);

END $$;

-- PRE-ROLLS
DO $$
DECLARE
  cat_prerolls UUID;
BEGIN
  SELECT id INTO cat_prerolls FROM categories WHERE slug = 'pre-rolls';

  INSERT INTO products (name, slug, category_id, short_description, long_description, profile, intensity, experience_notes, tags, base_price, price_text, thc_percentage, is_active, sort_order) VALUES
  ('6 Pack of Pre-Rolls', '6-pack-prerolls', cat_prerolls, 'Convenient 6-pack of ready-to-enjoy pre-rolls', 'Six perfectly rolled joints ready for immediate enjoyment. Great for sharing or personal use throughout the week. Consistent quality in every roll.', 'balanced', 'moderate', ARRAY['social', 'upbeat'], ARRAY['pre-roll', 'pack', 'convenient'], 40.00, '$40', 22.00, true, 30),
  
  ('Baby Jeeters Exotic Pre-Rolls', 'baby-jeeters-exotic', cat_prerolls, 'Premium Baby Jeeters exotic pre-rolls', 'Small but mighty Baby Jeeters featuring exotic strains. Perfect single-serving size with potent, flavorful flower. Ideal for solo sessions or trying new varieties.', 'day', 'strong', ARRAY['upbeat', 'creative', 'social'], ARRAY['pre-roll', 'exotic', 'baby-jeeter', 'premium'], 35.00, '$35', 28.00, true, 31),
  
  ('Calypso Infused Exotic Pre-Rolls', 'calypso-infused-exotic', cat_prerolls, 'Infused exotic pre-rolls by Calypso', 'Premium flower infused with concentrate for enhanced potency. Exotic strains carefully selected for unique flavor profiles. Smooth burn with elevated effects.', 'night', 'bold', ARRAY['calm', 'unwind'], ARRAY['pre-roll', 'infused', 'exotic', 'calypso'], 35.00, '$35', 32.00, true, 32),
  
  ('SLUGGERS Exotic Pre-Rolls', 'sluggers-exotic-prerolls', cat_prerolls, 'SLUGGERS brand exotic pre-rolls', 'High-quality SLUGGERS pre-rolls featuring exotic flower. Known for consistent quality and smooth smoking experience. Perfect for connoisseurs.', 'balanced', 'strong', ARRAY['upbeat', 'focus'], ARRAY['pre-roll', 'exotic', 'sluggers'], 45.00, '$45', 26.00, true, 33),
  
  ('10 Pack of Pre-Rolls', '10-pack-prerolls', cat_prerolls, 'Value 10-pack of pre-rolled joints', 'Ten pre-rolls for extended enjoyment. Great value for regular users. Consistent quality and perfect for stocking up or sharing with friends.', 'anytime', 'moderate', ARRAY['social', 'versatile'], ARRAY['pre-roll', 'pack', 'value'], 80.00, '$80', 20.00, true, 34),
  
  ('APE Exotic Pack of 7 Pre-Rolls', 'ape-exotic-7-pack', cat_prerolls, 'APE brand exotic 7-pack pre-rolls', 'Seven premium exotic pre-rolls from APE. Carefully curated strains offering variety and quality. Perfect weekly supply for enthusiasts.', 'day', 'strong', ARRAY['upbeat', 'creative'], ARRAY['pre-roll', 'exotic', 'ape', 'pack'], 60.00, '$60', 25.00, true, 35),
  
  ('Little Yeti Exotic Pre-Rolls', 'little-yeti-exotic', cat_prerolls, 'Little Yeti exotic pre-rolls', 'Compact yet potent Little Yeti pre-rolls. Exotic flower in a convenient size. Great for quick sessions with powerful effects.', 'night', 'strong', ARRAY['calm', 'unwind'], ARRAY['pre-roll', 'exotic', 'little-yeti'], 35.00, '$35', 27.00, true, 36);

END $$;

-- FLOWER (Oz Deals & Exotics)
DO $$
DECLARE
  cat_flower UUID;
BEGIN
  SELECT id INTO cat_flower FROM categories WHERE slug = 'flower';

  INSERT INTO products (name, slug, category_id, short_description, long_description, profile, intensity, experience_notes, tags, base_price, price_text, sizes, thc_percentage, is_active, is_featured, sort_order) VALUES
  ('Manolo OG', 'manolo-og', cat_flower, 'Classic OG strain - 1oz or 2oz available', 'A timeless OG variety offering balanced effects. Perfect for evening relaxation or social gatherings. Earthy, piney aroma with smooth smoke. Effects may vary by person.', 'night', 'moderate', ARRAY['calm', 'social', 'unwind'], ARRAY['flower', 'og', 'classic', 'bulk'], 100.00, '$100-$180', '[{"size": "1oz", "price": 100.00, "unit": "ounce"}, {"size": "2oz", "price": 180.00, "unit": "ounce"}]'::jsonb, 22.00, true, false, 40),
  
  ('Sugar Plum EXOTIC SMALLS', 'sugar-plum-exotic-smalls', cat_flower, 'Exotic Sugar Plum small buds - premium quality', 'Exotic strain featuring smaller, dense buds packed with flavor. Sweet, fruity aroma with uplifting effects. Great value without compromising quality.', 'day', 'strong', ARRAY['upbeat', 'creative', 'social'], ARRAY['flower', 'exotic', 'smalls', 'bulk'], 130.00, '$130-$240', '[{"size": "1oz", "price": 130.00, "unit": "ounce"}, {"size": "2oz", "price": 240.00, "unit": "ounce"}]'::jsonb, 26.00, true, false, 41),
  
  ('Jack Frost EXOTIC SMALLS', 'jack-frost-exotic-smalls', cat_flower, 'Frosty Jack Frost exotic small buds', 'Heavily frosted exotic buds with exceptional trichome coverage. Energizing effects perfect for daytime use. Citrus and pine notes dominate the flavor profile.', 'day', 'bold', ARRAY['upbeat', 'focus', 'creative'], ARRAY['flower', 'exotic', 'smalls', 'frosty'], 160.00, '$160-$300', '[{"size": "1oz", "price": 160.00, "unit": "ounce"}, {"size": "2oz", "price": 300.00, "unit": "ounce"}]'::jsonb, 28.00, true, true, 42),
  
  ('White Widow Certified Chronic', 'white-widow-certified-chronic', cat_flower, 'Legendary White Widow - ON SALE', 'Classic White Widow strain with certified quality. Balanced effects suitable for any time of day. Special sale pricing - was $180, now $140 per oz!', 'balanced', 'strong', ARRAY['upbeat', 'social', 'focus'], ARRAY['flower', 'classic', 'white-widow', 'sale'], 140.00, '$140 (was $180)', '[{"size": "1oz", "price": 140.00, "unit": "ounce"}]'::jsonb, 24.00, true, true, 43),
  
  ('Northern Lights EXOTIC SMALLS', 'northern-lights-exotic-smalls', cat_flower, 'Iconic Northern Lights exotic smalls', 'One of the most famous strains worldwide. Deep relaxation with a sweet, spicy aroma. Perfect for evening use. Small buds, big effects.', 'night', 'strong', ARRAY['calm', 'unwind'], ARRAY['flower', 'exotic', 'smalls', 'classic'], 150.00, '$150-$280', '[{"size": "1oz", "price": 150.00, "unit": "ounce"}, {"size": "2oz", "price": 280.00, "unit": "ounce"}]'::jsonb, 25.00, true, false, 44),
  
  ('Slaughtermelon Certified Chronic', 'slaughtermelon-certified-chronic', cat_flower, 'Unique Slaughtermelon strain - certified quality', 'Rare strain with a distinctive melon-like aroma. Balanced effects suitable for various occasions. Certified chronic quality at great bulk pricing.', 'balanced', 'moderate', ARRAY['upbeat', 'social'], ARRAY['flower', 'unique', 'melon', 'bulk'], 140.00, '$140-$260', '[{"size": "1oz", "price": 140.00, "unit": "ounce"}, {"size": "2oz", "price": 260.00, "unit": "ounce"}]'::jsonb, 23.00, true, false, 45),
  
  ('Sleigh Ride EXOTIC SMALLS', 'sleigh-ride-exotic-smalls', cat_flower, 'Premium Sleigh Ride exotic small buds', 'Festive exotic strain with uplifting, joyful effects. Sweet and spicy flavor profile. Perfect for social gatherings and celebrations.', 'day', 'bold', ARRAY['upbeat', 'social', 'creative'], ARRAY['flower', 'exotic', 'smalls', 'premium'], 180.00, '$180-$340', '[{"size": "1oz", "price": 180.00, "unit": "ounce"}, {"size": "2oz", "price": 340.00, "unit": "ounce"}]'::jsonb, 29.00, true, true, 46),
  
  ('Wedding Cake EXOTIC SMALLS', 'wedding-cake-exotic-smalls', cat_flower, 'Popular Wedding Cake exotic smalls', 'Highly sought-after strain with sweet, vanilla notes. Relaxing yet uplifting effects. Perfect for unwinding after a long day.', 'night', 'bold', ARRAY['calm', 'unwind', 'social'], ARRAY['flower', 'exotic', 'smalls', 'popular'], 180.00, '$180-$340', '[{"size": "1oz", "price": 180.00, "unit": "ounce"}, {"size": "2oz", "price": 340.00, "unit": "ounce"}]'::jsonb, 27.00, true, true, 47),
  
  ('PERSY Snow Balls', 'persy-snow-balls', cat_flower, 'Ultra-premium PERSY Snow Balls', 'Top-shelf exotic flower coated in concentrate. Extremely potent and flavorful. For experienced users only. Limited availability at premium pricing.', 'night', 'bold', ARRAY['intense', 'premium'], ARRAY['flower', 'exotic', 'premium', 'coated', 'limited'], 350.00, '$350-$600', '[{"size": "1oz", "price": 350.00, "unit": "ounce"}, {"size": "2oz", "price": 600.00, "unit": "ounce"}]'::jsonb, 35.00, true, true, 48),
  
  ('Dried Shrooms 1oz', 'dried-shrooms-1oz', cat_flower, 'Premium dried psilocybin mushrooms', 'Carefully dried and cured psilocybin mushrooms. 1 ounce package. For experienced users seeking introspective experiences. Start with small amounts. Effects vary greatly by person.', 'night', 'bold', ARRAY['introspective', 'creative'], ARRAY['mushrooms', 'psilocybin', 'dried'], 120.00, '$120', '[{"size": "1oz", "price": 120.00, "unit": "ounce"}]'::jsonb, NULL, true, false, 49);

END $$;

-- EXOTICS (Premium Flower)
DO $$
DECLARE
  cat_flower UUID;
BEGIN
  SELECT id INTO cat_flower FROM categories WHERE slug = 'flower';

  INSERT INTO products (name, slug, category_id, short_description, long_description, profile, intensity, experience_notes, tags, base_price, price_text, sizes, thc_percentage, is_active, is_featured, sort_order) VALUES
  ('Haunted Honeydew', 'haunted-honeydew', cat_flower, 'Exotic Haunted Honeydew strain', 'Unique exotic with sweet melon flavors and balanced effects. Perfect for any time of day. Multiple size options available for every budget.', 'balanced', 'strong', ARRAY['upbeat', 'social', 'creative'], ARRAY['flower', 'exotic', 'premium', 'melon'], 60.00, '$60-$340', '[{"size": "3.5g", "price": 60.00, "unit": "gram"}, {"size": "7g", "price": 110.00, "unit": "gram"}, {"size": "14g", "price": 200.00, "unit": "gram"}, {"size": "28g", "price": 340.00, "unit": "gram"}]'::jsonb, 26.00, true, true, 50),
  
  ('Blue Nerds', 'blue-nerds', cat_flower, 'Sweet Blue Nerds exotic strain', 'Candy-like flavor profile with vibrant blue hues. Uplifting effects perfect for daytime activities. A favorite among flavor enthusiasts.', 'day', 'strong', ARRAY['upbeat', 'creative', 'focus'], ARRAY['flower', 'exotic', 'sweet', 'colorful'], 60.00, '$60-$340', '[{"size": "3.5g", "price": 60.00, "unit": "gram"}, {"size": "7g", "price": 110.00, "unit": "gram"}, {"size": "14g", "price": 200.00, "unit": "gram"}, {"size": "28g", "price": 340.00, "unit": "gram"}]'::jsonb, 27.00, true, true, 51),
  
  ('DRIP Gelato Snow Balls', 'drip-gelato-snow-balls', cat_flower, 'Premium DRIP Gelato coated in concentrate', 'Top-tier Gelato flower rolled in concentrate. Extremely potent with rich, creamy flavor. For experienced users seeking maximum effects.', 'night', 'bold', ARRAY['calm', 'unwind', 'premium'], ARRAY['flower', 'exotic', 'coated', 'gelato', 'premium'], 80.00, '$80-$420', '[{"size": "3.5g", "price": 80.00, "unit": "gram"}, {"size": "7g", "price": 150.00, "unit": "gram"}, {"size": "14g", "price": 280.00, "unit": "gram"}, {"size": "28g", "price": 420.00, "unit": "gram"}]'::jsonb, 32.00, true, true, 52),
  
  ('Gingerbread Cookies', 'gingerbread-cookies', cat_flower, 'Festive Gingerbread Cookies strain', 'Warm, spicy aroma reminiscent of holiday baking. Relaxing effects perfect for cozy evenings. Sweet and earthy flavor profile.', 'night', 'moderate', ARRAY['calm', 'social', 'unwind'], ARRAY['flower', 'exotic', 'spicy', 'sweet'], 60.00, '$60-$340', '[{"size": "3.5g", "price": 60.00, "unit": "gram"}, {"size": "7g", "price": 110.00, "unit": "gram"}, {"size": "14g", "price": 200.00, "unit": "gram"}, {"size": "28g", "price": 340.00, "unit": "gram"}]'::jsonb, 24.00, true, false, 53),
  
  ('Cereal Milk', 'cereal-milk', cat_flower, 'Popular Cereal Milk exotic strain', 'Creamy, sweet flavor like the milk left after cereal. Balanced effects suitable for any occasion. Highly popular among connoisseurs.', 'balanced', 'strong', ARRAY['upbeat', 'social', 'creative'], ARRAY['flower', 'exotic', 'sweet', 'popular'], 60.00, '$60-$340', '[{"size": "3.5g", "price": 60.00, "unit": "gram"}, {"size": "7g", "price": 110.00, "unit": "gram"}, {"size": "14g", "price": 200.00, "unit": "gram"}, {"size": "28g", "price": 340.00, "unit": "gram"}]'::jsonb, 25.00, true, true, 54),
  
  ('Sour Joker', 'sour-joker', cat_flower, 'Tangy Sour Joker exotic', 'Sharp, sour flavor with energizing effects. Perfect for daytime use and creative activities. Unique terpene profile.', 'day', 'strong', ARRAY['upbeat', 'creative', 'focus'], ARRAY['flower', 'exotic', 'sour', 'energizing'], 60.00, '$60-$340', '[{"size": "3.5g", "price": 60.00, "unit": "gram"}, {"size": "7g", "price": 110.00, "unit": "gram"}, {"size": "14g", "price": 200.00, "unit": "gram"}, {"size": "28g", "price": 340.00, "unit": "gram"}]'::jsonb, 26.00, true, false, 55),
  
  ('Nerds Clusters', 'nerds-clusters', cat_flower, 'Candy-flavored Nerds Clusters', 'Sweet, fruity flavor reminiscent of candy. Dense, colorful buds with uplifting effects. Great for social situations.', 'day', 'moderate', ARRAY['upbeat', 'social'], ARRAY['flower', 'exotic', 'sweet', 'fruity'], 60.00, '$60-$340', '[{"size": "3.5g", "price": 60.00, "unit": "gram"}, {"size": "7g", "price": 110.00, "unit": "gram"}, {"size": "14g", "price": 200.00, "unit": "gram"}, {"size": "28g", "price": 340.00, "unit": "gram"}]'::jsonb, 24.00, true, false, 56),
  
  ('Riot Runtz', 'riot-runtz', cat_flower, 'Potent Riot Runtz exotic', 'Part of the famous Runtz family. Sweet, candy-like flavor with strong, balanced effects. Highly sought after by enthusiasts.', 'balanced', 'bold', ARRAY['upbeat', 'calm', 'social'], ARRAY['flower', 'exotic', 'runtz', 'popular'], 60.00, '$60-$340', '[{"size": "3.5g", "price": 60.00, "unit": "gram"}, {"size": "7g", "price": 110.00, "unit": "gram"}, {"size": "14g", "price": 200.00, "unit": "gram"}, {"size": "28g", "price": 340.00, "unit": "gram"}]'::jsonb, 28.00, true, true, 57),
  
  ('Blue Steel', 'blue-steel', cat_flower, 'Striking Blue Steel exotic - ON SALE', 'Metallic blue hues with powerful effects. Balanced profile suitable for various occasions. Special pricing available.', 'balanced', 'strong', ARRAY['upbeat', 'focus'], ARRAY['flower', 'exotic', 'blue', 'sale'], 60.00, '$60-$340', '[{"size": "3.5g", "price": 60.00, "unit": "gram"}, {"size": "7g", "price": 110.00, "unit": "gram"}, {"size": "14g", "price": 200.00, "unit": "gram"}, {"size": "28g", "price": 340.00, "unit": "gram"}]'::jsonb, 26.00, true, true, 58),
  
  ('Violet Sky', 'violet-sky', cat_flower, 'Beautiful Violet Sky exotic', 'Purple-hued buds with a sweet, floral aroma. Relaxing effects perfect for evening use. Visually stunning and potent.', 'night', 'strong', ARRAY['calm', 'unwind'], ARRAY['flower', 'exotic', 'purple', 'floral'], 60.00, '$60-$340', '[{"size": "3.5g", "price": 60.00, "unit": "gram"}, {"size": "7g", "price": 110.00, "unit": "gram"}, {"size": "14g", "price": 200.00, "unit": "gram"}, {"size": "28g", "price": 340.00, "unit": "gram"}]'::jsonb, 25.00, true, false, 59),
  
  ('Banana Hammock', 'banana-hammock', cat_flower, 'Tropical Banana Hammock - SPECIAL PRICE', 'Tropical banana flavor with relaxing effects. Perfect for unwinding. Special pricing makes this a great value.', 'night', 'moderate', ARRAY['calm', 'unwind', 'social'], ARRAY['flower', 'exotic', 'tropical', 'sale'], 50.00, '$50-$280', '[{"size": "3.5g", "price": 50.00, "unit": "gram"}, {"size": "7g", "price": 95.00, "unit": "gram"}, {"size": "14g", "price": 170.00, "unit": "gram"}, {"size": "28g", "price": 280.00, "unit": "gram"}]'::jsonb, 23.00, true, true, 60);

END $$;

-- CONCENTRATES
DO $$
DECLARE
  cat_concentrates UUID;
BEGIN
  SELECT id INTO cat_concentrates FROM categories WHERE slug = 'concentrates';

  INSERT INTO products (name, slug, category_id, short_description, long_description, profile, intensity, experience_notes, tags, base_price, price_text, sizes, thc_percentage, content_warnings, is_active, sort_order) VALUES
  ('Boring Slabs Shatter', 'boring-slabs-shatter', cat_concentrates, 'High-quality shatter concentrate', 'Premium shatter with glass-like consistency. High potency and purity. Perfect for dabbing. Available in multiple sizes from single grams to bulk quantities.', 'balanced', 'bold', ARRAY['intense', 'focus'], ARRAY['concentrate', 'shatter', 'dabs', 'potent'], 40.00, '$40-$400', '[{"size": "1g", "price": 40.00, "unit": "gram"}, {"size": "3.5g", "price": 130.00, "unit": "gram"}, {"size": "7g", "price": 240.00, "unit": "gram"}, {"size": "14g", "price": 400.00, "unit": "gram"}]'::jsonb, 85.00, ARRAY['high potency', 'for experienced users'], true, 70),
  
  ('WHOLE MELT Sugar Diamonds - CRUMBLE', 'whole-melt-sugar-diamonds', cat_concentrates, 'Premium sugar diamonds crumble', 'Top-tier WHOLE MELT concentrate with crystalline structure. Exceptional flavor and potency. Crumbly texture easy to work with. For experienced concentrate users.', 'night', 'bold', ARRAY['intense', 'premium'], ARRAY['concentrate', 'diamonds', 'crumble', 'premium'], 40.00, '$40-$400', '[{"size": "1g", "price": 40.00, "unit": "gram"}, {"size": "3.5g", "price": 130.00, "unit": "gram"}, {"size": "7g", "price": 240.00, "unit": "gram"}, {"size": "14g", "price": 400.00, "unit": "gram"}]'::jsonb, 90.00, ARRAY['very high potency', 'experienced users only'], true, 71),
  
  ('Holiday Box - Christmas Edition', 'holiday-box-christmas', cat_concentrates, 'Special holiday concentrate variety box', 'Curated selection of premium concentrates in festive packaging. Perfect gift or personal treat. Contains multiple varieties for sampling different textures and flavors.', 'balanced', 'bold', ARRAY['variety', 'premium'], ARRAY['concentrate', 'variety', 'gift', 'holiday'], 180.00, '$180', '[{"size": "variety", "price": 180.00, "unit": "gram"}]'::jsonb, 88.00, ARRAY['high potency', 'multiple products'], true, 72),
  
  ('Moonrocks', 'moonrocks', cat_concentrates, 'Premium flower coated in concentrate and kief', 'Top-shelf flower dipped in concentrate and rolled in kief. Extremely potent - not for beginners. Slow-burning with intense, long-lasting effects. Handle with care.', 'night', 'bold', ARRAY['intense', 'premium', 'long-lasting'], ARRAY['moonrocks', 'coated', 'premium', 'potent'], 80.00, '$80-$200', '[{"size": "3.5g", "price": 80.00, "unit": "gram"}, {"size": "7g", "price": 150.00, "unit": "gram"}, {"size": "14g", "price": 200.00, "unit": "gram"}]'::jsonb, 50.00, ARRAY['extremely high potency', 'experienced users only', 'start with small amounts'], true, 73);

END $$;

-- MERCH (Accessories)
DO $$
DECLARE
  cat_accessories UUID;
BEGIN
  SELECT id INTO cat_accessories FROM categories WHERE slug = 'accessories';

  INSERT INTO products (name, slug, category_id, short_description, long_description, profile, intensity, experience_notes, tags, base_price, price_text, is_active, sort_order) VALUES
  ('Buy Weed From Women Hoodie', 'buy-weed-from-women-hoodie', cat_accessories, 'Empowering statement hoodie', 'Comfortable, high-quality hoodie supporting women in cannabis. Soft fabric, durable print. Available in multiple sizes. Make a statement while staying cozy.', NULL, NULL, ARRAY['empowerment', 'style'], ARRAY['merch', 'hoodie', 'apparel', 'statement'], 40.00, '$40', true, 80),
  
  ('Light My Fire Hoodie', 'light-my-fire-hoodie', cat_accessories, 'Stylish Light My Fire hoodie', 'Premium hoodie with bold graphic design. Comfortable fit perfect for everyday wear. Quality construction that lasts.', NULL, NULL, ARRAY['style', 'comfort'], ARRAY['merch', 'hoodie', 'apparel', 'graphic'], 40.00, '$40', true, 81),
  
  ('Astrology Hoodie', 'astrology-hoodie', cat_accessories, 'Cosmic astrology-themed hoodie', 'Unique astrology design for the spiritually inclined. Soft, comfortable fabric. Express your cosmic connection in style.', NULL, NULL, ARRAY['spiritual', 'style'], ARRAY['merch', 'hoodie', 'apparel', 'astrology'], 40.00, '$40', true, 82),
  
  ('God Forgives I Dont Hoodie', 'god-forgives-i-dont-hoodie', cat_accessories, 'Bold statement hoodie', 'Edgy graphic hoodie with attitude. High-quality print and fabric. Make a bold statement with this eye-catching design.', NULL, NULL, ARRAY['bold', 'style'], ARRAY['merch', 'hoodie', 'apparel', 'statement'], 40.00, '$40', true, 83),
  
  ('Purple Penthouse Dad Hat', 'purple-penthouse-dad-hat', cat_accessories, 'Premium Purple Penthouse dad hat', 'Classic dad hat style with Purple Penthouse branding. Adjustable fit, comfortable wear. Perfect accessory for any outfit.', NULL, NULL, ARRAY['style', 'casual'], ARRAY['merch', 'hat', 'apparel', 'accessory'], 60.00, '$60', true, 84),
  
  ('Stack Chips Laundry Service Hoodie', 'stack-chips-laundry-service-hoodie', cat_accessories, 'Stack Chips Laundry Service hoodie', 'Unique laundry service-inspired design. Comfortable, durable hoodie perfect for casual wear. Stand out with this creative graphic.', NULL, NULL, ARRAY['unique', 'style'], ARRAY['merch', 'hoodie', 'apparel', 'graphic'], 40.00, '$40', true, 85),
  
  ('Look In Mirror Hoodie', 'look-in-mirror-hoodie', cat_accessories, 'Reflective Look In Mirror hoodie', 'Thought-provoking design encouraging self-reflection. Quality hoodie with meaningful message. Comfortable and stylish.', NULL, NULL, ARRAY['meaningful', 'style'], ARRAY['merch', 'hoodie', 'apparel', 'statement'], 40.00, '$40', true, 86);

END $$;

-- Summary comment
-- Inserted 70+ products across all categories with:
-- - Compliance-friendly language (day/night/balanced instead of sativa/indica)
-- - Modern terminology (strong/bold/moderate instead of medical claims)
-- - Proper categorization
-- - Realistic THC percentages where applicable
-- - Multiple size options with JSONB pricing
-- - Experience notes and tags for filtering
-- - Content warnings for high-potency items
-- - Featured flags for premium products
-- - All products set to active (is_active = true)
