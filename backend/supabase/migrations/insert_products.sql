/*
Bulk upsert for upliftroom.com products.

IMPORTANT:
- thc_percentage / cbd_percentage below are PLACEHOLDER estimates for non-edible items where a % is typical.
- Edibles + merch keep thc/cbd NULL.
- Replace placeholders with lab-verified values when available.
- Images are intentionally NULL (per your request).
*/

INSERT INTO products (
  name,
  slug,
  category_id,
  short_description,
  long_description,
  profile,
  intensity,
  experience_notes,
  tags,
  base_price,
  price_text,
  sizes,
  image_cover_path,
  image_gallery_paths,
  lab_report_url,
  thc_percentage,
  cbd_percentage,
  content_warnings,
  is_active,
  is_featured,
  sort_order
)
SELECT * FROM (
  VALUES
    ('Dean and Deluca Gummies (500 mg)','dean-and-deluca-gummies-500-mg',(SELECT id FROM categories WHERE slug='edibles'),'Edible-friendly pick for a steady, in-the-middle feel. Easy to dose, easy to enjoy—start low, go slow.','Edible-friendly pick for a steady, in-the-middle feel. Easy to dose, easy to enjoy—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','moderate',ARRAY['social','calm']::text[],ARRAY['edible','treat','gummies','lifestyle','upliftroom']::text[],60.0,'$60','[{"size": "pack", "price": 60.0, "unit": "pack"}]'::jsonb,NULL,NULL,NULL,NULL,NULL,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Elysian Psilocybin Tincture Oil – A Powerful Experience','elysian-psilocybin-tincture-oil-a-powerful-experience',(SELECT id FROM categories WHERE slug='edibles'),'Edible-friendly pick for a steady, in-the-middle feel. Easy to dose, easy to enjoy—start low, go slow.','Edible-friendly pick for a steady, in-the-middle feel. Easy to dose, easy to enjoy—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','moderate',ARRAY['social','calm']::text[],ARRAY['edible','treat','lifestyle','upliftroom']::text[],45.0,'$45','[{"size": "bottle", "price": 45.0, "unit": "bottle"}]'::jsonb,NULL,NULL,NULL,NULL,NULL,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Polka Shot – A Unique Infusion FIRE SALE','polka-shot-a-unique-infusion-fire-sale',(SELECT id FROM categories WHERE slug='edibles'),'Edible-friendly pick for a steady, in-the-middle feel. Easy to dose, easy to enjoy—start low, go slow.','Edible-friendly pick for a steady, in-the-middle feel. Easy to dose, easy to enjoy—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','moderate',ARRAY['social','calm']::text[],ARRAY['edible','treat','shot','sale','lifestyle','upliftroom']::text[],20.0,'$20','[{"size": "single", "price": 20.0, "unit": "item"}]'::jsonb,NULL,NULL,NULL,NULL,NULL,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Polkadot Syrup – A Sweet & Potent Cannabis Infusion','polkadot-syrup-a-sweet-potent-cannabis-infusion',(SELECT id FROM categories WHERE slug='edibles'),'Edible-friendly pick for a steady, in-the-middle feel. Easy to dose, easy to enjoy—start low, go slow.','Edible-friendly pick for a steady, in-the-middle feel. Easy to dose, easy to enjoy—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','moderate',ARRAY['social','calm']::text[],ARRAY['edible','treat','syrup','lifestyle','upliftroom']::text[],80.0,'$80','[{"size": "bottle", "price": 80.0, "unit": "bottle"}]'::jsonb,NULL,NULL,NULL,NULL,NULL,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('HOLIDAZE Mystery Edible Special (400 mg–1000 mg)','holidaze-mystery-edible-special-400-mg-1000-mg',(SELECT id FROM categories WHERE slug='edibles'),'Edible-friendly pick for a steady, in-the-middle feel. Easy to dose, easy to enjoy—start low, go slow.','Edible-friendly pick for a steady, in-the-middle feel. Easy to dose, easy to enjoy—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','moderate',ARRAY['social','calm']::text[],ARRAY['edible','treat','lifestyle','upliftroom']::text[],NULL,'$40–$100','[{"size": "standard", "price": 40.0, "unit": "pack"}, {"size": "max", "price": 100.0, "unit": "pack"}]'::jsonb,NULL,NULL,NULL,NULL,NULL,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),

    ('Sprinkles 2 g Disposable Cart','sprinkles-2-g-disposable-cart',(SELECT id FROM categories WHERE slug='vapes'),'Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.','Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','bold',ARRAY['social','calm','unwind']::text[],ARRAY['vape','cartridge','lifestyle','upliftroom']::text[],80.0,'$80','[{"size": "2g", "price": 80.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,88.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Slugger 2 g Carts','slugger-2-g-carts',(SELECT id FROM categories WHERE slug='vapes'),'Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.','Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','bold',ARRAY['social','calm','unwind']::text[],ARRAY['vape','cartridge','lifestyle','upliftroom']::text[],80.0,'$80','[{"size": "2g", "price": 80.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,88.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Boutiq Switch Liquid Live Diamonds Dual Tank 2 g Disposable Cart','boutiq-switch-liquid-live-diamonds-dual-tank-2-g-disposable-cart',(SELECT id FROM categories WHERE slug='vapes'),'Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.','Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','bold',ARRAY['social','calm','unwind']::text[],ARRAY['vape','cartridge','diamonds','lifestyle','upliftroom']::text[],80.0,'$80','[{"size": "2g", "price": 80.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,88.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Choice 2 g Carts','choice-2-g-carts',(SELECT id FROM categories WHERE slug='vapes'),'Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.','Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','bold',ARRAY['social','calm','unwind']::text[],ARRAY['vape','cartridge','lifestyle','upliftroom']::text[],80.0,'$80','[{"size": "2g", "price": 80.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,88.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Wholemelt 2 g Disposable Cart','wholemelt-2-g-disposable-cart',(SELECT id FROM categories WHERE slug='vapes'),'Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.','Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','bold',ARRAY['social','calm','unwind']::text[],ARRAY['vape','cartridge','lifestyle','upliftroom']::text[],60.0,'$60','[{"size": "2g", "price": 60.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,88.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Smoothie Bar – 2 g Dual Chamber Vape','smoothie-bar-2-g-dual-chamber-vape',(SELECT id FROM categories WHERE slug='vapes'),'Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.','Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','bold',ARRAY['social','calm','unwind']::text[],ARRAY['vape','cartridge','lifestyle','upliftroom']::text[],80.0,'$80','[{"size": "2g", "price": 80.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,88.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),

    ('Raw Garden Carts 1 g Cart','raw-garden-carts-1-g-cart',(SELECT id FROM categories WHERE slug='vapes'),'Smooth pull, bright, clean daytime energy. Built for quick, consistent sessions—keep it simple and keep it moving.','Smooth pull, bright, clean daytime energy. Built for quick, consistent sessions—keep it simple and keep it moving.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','day','bold',ARRAY['upbeat','focus','social','unwind']::text[],ARRAY['vape','cartridge','lifestyle','upliftroom']::text[],40.0,'$40','[{"size": "1g", "price": 40.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,85.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('APE – 1 g Disposable Cart','ape-1-g-disposable-cart',(SELECT id FROM categories WHERE slug='vapes'),'Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.','Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','bold',ARRAY['social','calm','unwind']::text[],ARRAY['vape','cartridge','lifestyle','upliftroom']::text[],40.0,'$40','[{"size": "1g", "price": 40.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,85.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Cali 1 g Cart','cali-1-g-cart',(SELECT id FROM categories WHERE slug='vapes'),'Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.','Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','bold',ARRAY['social','calm','unwind']::text[],ARRAY['vape','cartridge','lifestyle','upliftroom']::text[],40.0,'$40','[{"size": "1g", "price": 40.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,85.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Muha Meds 1 g Cart','muha-meds-1-g-cart',(SELECT id FROM categories WHERE slug='vapes'),'Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.','Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','bold',ARRAY['social','calm','unwind']::text[],ARRAY['vape','cartridge','lifestyle','upliftroom']::text[],40.0,'$40','[{"size": "1g", "price": 40.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,85.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Jeeter Juice 1 g Cart','jeeter-juice-1-g-cart',(SELECT id FROM categories WHERE slug='vapes'),'Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.','Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','bold',ARRAY['social','calm','unwind']::text[],ARRAY['vape','cartridge','lifestyle','upliftroom']::text[],40.0,'$40','[{"size": "1g", "price": 40.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,85.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),

    ('6 Pack of Pre-Rolls','6-pack-of-pre-rolls',(SELECT id FROM categories WHERE slug='pre-rolls'),'Ready-to-go rolls with a steady, in-the-middle feel. No setup, no fuss—just light, share, and chill.','Ready-to-go rolls with a steady, in-the-middle feel. No setup, no fuss—just light, share, and chill.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','moderate',ARRAY['social','calm']::text[],ARRAY['pre-roll','ready','lifestyle','upliftroom']::text[],40.0,'$40','[{"size": "6 pack", "price": 40.0, "unit": "pack"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Baby Jeeters Exotic Pre-Rolls','baby-jeeters-exotic-pre-rolls',(SELECT id FROM categories WHERE slug='pre-rolls'),'Ready-to-go rolls with a steady, in-the-middle feel. No setup, no fuss—just light, share, and chill.','Ready-to-go rolls with a steady, in-the-middle feel. No setup, no fuss—just light, share, and chill.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','strong',ARRAY['social','calm','unwind']::text[],ARRAY['pre-roll','ready','exotic','lifestyle','upliftroom']::text[],35.0,'$35','[{"size": "pack", "price": 35.0, "unit": "pack"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Calypso Infused Exotic Pre-Rolls','calypso-infused-exotic-pre-rolls',(SELECT id FROM categories WHERE slug='pre-rolls'),'Ready-to-go rolls with a steady, in-the-middle feel. No setup, no fuss—just light, share, and chill.','Ready-to-go rolls with a steady, in-the-middle feel. No setup, no fuss—just light, share, and chill.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','strong',ARRAY['social','calm','unwind']::text[],ARRAY['pre-roll','ready','exotic','lifestyle','upliftroom']::text[],35.0,'$35','[{"size": "pack", "price": 35.0, "unit": "pack"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('SLUGGERS Exotic Pre-Rolls','sluggers-exotic-pre-rolls',(SELECT id FROM categories WHERE slug='pre-rolls'),'Ready-to-go rolls with a steady, in-the-middle feel. No setup, no fuss—just light, share, and chill.','Ready-to-go rolls with a steady, in-the-middle feel. No setup, no fuss—just light, share, and chill.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','strong',ARRAY['social','calm','unwind']::text[],ARRAY['pre-roll','ready','exotic','lifestyle','upliftroom']::text[],45.0,'$45','[{"size": "pack", "price": 45.0, "unit": "pack"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('10 Pack of Pre-Rolls','10-pack-of-pre-rolls',(SELECT id FROM categories WHERE slug='pre-rolls'),'Ready-to-go rolls with a steady, in-the-middle feel. No setup, no fuss—just light, share, and chill.','Ready-to-go rolls with a steady, in-the-middle feel. No setup, no fuss—just light, share, and chill.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','moderate',ARRAY['social','calm']::text[],ARRAY['pre-roll','ready','lifestyle','upliftroom']::text[],80.0,'$80','[{"size": "10 pack", "price": 80.0, "unit": "pack"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('APE Exotic Pack of 7 Pre-Rolls','ape-exotic-pack-of-7-pre-rolls',(SELECT id FROM categories WHERE slug='pre-rolls'),'Ready-to-go rolls with a steady, in-the-middle feel. No setup, no fuss—just light, share, and chill.','Ready-to-go rolls with a steady, in-the-middle feel. No setup, no fuss—just light, share, and chill.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','strong',ARRAY['social','calm','unwind']::text[],ARRAY['pre-roll','ready','exotic','lifestyle','upliftroom']::text[],60.0,'$60','[{"size": "7 pack", "price": 60.0, "unit": "pack"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Little Yeti Exotic Pre-Rolls','little-yeti-exotic-pre-rolls',(SELECT id FROM categories WHERE slug='pre-rolls'),'Ready-to-go rolls with a steady, in-the-middle feel. No setup, no fuss—just light, share, and chill.','Ready-to-go rolls with a steady, in-the-middle feel. No setup, no fuss—just light, share, and chill.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','strong',ARRAY['social','calm','unwind']::text[],ARRAY['pre-roll','ready','exotic','lifestyle','upliftroom']::text[],35.0,'$35','[{"size": "pack", "price": 35.0, "unit": "pack"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),

    ('1 oz or 2 oz Special: Manolo OG','1-oz-or-2-oz-special-manolo-og',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','moderate',ARRAY['social','calm']::text[],ARRAY['flower','fresh','lifestyle','upliftroom']::text[],NULL,'$100–$180','[{"size": "1 oz", "price": 100.0, "unit": "ounce"}, {"size": "2 oz", "price": 180.0, "unit": "ounce"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('1 oz or 2 oz Special: Sugar Plum EXOTIC SMALLS','1-oz-or-2-oz-special-sugar-plum-exotic-smalls',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','strong',ARRAY['social','calm','unwind']::text[],ARRAY['flower','fresh','exotic','lifestyle','upliftroom']::text[],NULL,'$130–$240','[{"size": "1 oz", "price": 130.0, "unit": "ounce"}, {"size": "2 oz", "price": 240.0, "unit": "ounce"}]'::jsonb,NULL,NULL,NULL,26.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('1 oz or 2 oz: Jack Frost EXOTIC SMALLS','1-oz-or-2-oz-jack-frost-exotic-smalls',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a bright, clean daytime energy. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a bright, clean daytime energy. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','day','strong',ARRAY['upbeat','focus','social','unwind']::text[],ARRAY['flower','fresh','exotic','lifestyle','upliftroom']::text[],NULL,'$160–$300','[{"size": "1 oz", "price": 160.0, "unit": "ounce"}, {"size": "2 oz", "price": 300.0, "unit": "ounce"}]'::jsonb,NULL,NULL,NULL,26.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('1 oz or 2 oz Special: White Widow Certified Chronic','1-oz-or-2-oz-special-white-widow-certified-chronic',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a bright, clean daytime energy. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a bright, clean daytime energy. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','day','moderate',ARRAY['upbeat','focus','social']::text[],ARRAY['flower','fresh','lifestyle','upliftroom','sale']::text[],140.0,'$140 (sale; was $180)','[{"size": "1 oz", "price": 140.0, "unit": "ounce"}, {"size": "2 oz", "price": 140.0, "unit": "ounce"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('1 oz or 2 oz Special: Northern Lights EXOTIC SMALLS','1-oz-or-2-oz-special-northern-lights-exotic-smalls',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a slow-it-down, cozy night vibe. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a slow-it-down, cozy night vibe. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','night','strong',ARRAY['unwind','calm']::text[],ARRAY['flower','fresh','exotic','lifestyle','upliftroom']::text[],NULL,'$150–$280','[{"size": "1 oz", "price": 150.0, "unit": "ounce"}, {"size": "2 oz", "price": 280.0, "unit": "ounce"}]'::jsonb,NULL,NULL,NULL,26.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('1 oz or 2 oz Special: Slaughtermelon – Certified Chronic','1-oz-or-2-oz-special-slaughtermelon-certified-chronic',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a slow-it-down, cozy night vibe. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a slow-it-down, cozy night vibe. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','night','moderate',ARRAY['unwind','calm']::text[],ARRAY['flower','fresh','lifestyle','upliftroom']::text[],NULL,'$140–$260','[{"size": "1 oz", "price": 140.0, "unit": "ounce"}, {"size": "2 oz", "price": 260.0, "unit": "ounce"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('1 oz or 2 oz Special: Sleigh Ride EXOTIC SMALLS','1-oz-or-2-oz-special-sleigh-ride-exotic-smalls',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','strong',ARRAY['social','calm','unwind']::text[],ARRAY['flower','fresh','exotic','lifestyle','upliftroom']::text[],NULL,'$180–$340','[{"size": "1 oz", "price": 180.0, "unit": "ounce"}, {"size": "2 oz", "price": 340.0, "unit": "ounce"}]'::jsonb,NULL,NULL,NULL,26.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('1 oz or 2 oz Special: Wedding Cake EXOTIC SMALLS','1-oz-or-2-oz-special-wedding-cake-exotic-smalls',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a slow-it-down, cozy night vibe. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a slow-it-down, cozy night vibe. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','night','strong',ARRAY['unwind','calm']::text[],ARRAY['flower','fresh','exotic','lifestyle','upliftroom']::text[],NULL,'$180–$340','[{"size": "1 oz", "price": 180.0, "unit": "ounce"}, {"size": "2 oz", "price": 340.0, "unit": "ounce"}]'::jsonb,NULL,NULL,NULL,26.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('1 oz or 2 oz Special: PERSY Snow Balls','1-oz-or-2-oz-special-persy-snow-balls',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a slow-it-down, cozy night vibe. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a slow-it-down, cozy night vibe. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','night','bold',ARRAY['unwind','calm']::text[],ARRAY['flower','fresh','lifestyle','upliftroom']::text[],NULL,'$350–$600','[{"size": "1 oz", "price": 350.0, "unit": "ounce"}, {"size": "2 oz", "price": 600.0, "unit": "ounce"}]'::jsonb,NULL,NULL,NULL,30.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Get 1 Oz of Dried Shrooms for $120','get-1-oz-of-dried-shrooms-for-120',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','moderate',ARRAY['social','calm']::text[],ARRAY['flower','fresh','lifestyle','upliftroom']::text[],120.0,'$120','[{"size": "1 oz", "price": 120.0, "unit": "ounce"}]'::jsonb,NULL,NULL,NULL,NULL,NULL,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),

    ('Haunted Honeydew','haunted-honeydew',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','moderate',ARRAY['social','calm']::text[],ARRAY['flower','fresh','honeydew','lifestyle','upliftroom']::text[],NULL,'$60–$340','[{"size": "3.5g", "price": 60.0, "unit": "gram"}, {"size": "7g", "price": 114.0, "unit": "gram"}, {"size": "14g", "price": 216.0, "unit": "gram"}, {"size": "28g", "price": 340.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Blue Nerds','blue-nerds',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','moderate',ARRAY['social','calm']::text[],ARRAY['flower','fresh','nerds','lifestyle','upliftroom']::text[],NULL,'$60–$340','[{"size": "3.5g", "price": 60.0, "unit": "gram"}, {"size": "7g", "price": 114.0, "unit": "gram"}, {"size": "14g", "price": 216.0, "unit": "gram"}, {"size": "28g", "price": 340.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('DRIP “Gelato Snow Balls”','drip-gelato-snow-balls',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a slow-it-down, cozy night vibe. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a slow-it-down, cozy night vibe. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','night','strong',ARRAY['unwind','calm']::text[],ARRAY['flower','fresh','gelato','lifestyle','upliftroom']::text[],NULL,'$80–$420','[{"size": "3.5g", "price": 80.0, "unit": "gram"}, {"size": "7g", "price": 152.0, "unit": "gram"}, {"size": "14g", "price": 288.0, "unit": "gram"}, {"size": "28g", "price": 420.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,26.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Gingerbread Cookies','gingerbread-cookies',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','moderate',ARRAY['social','calm']::text[],ARRAY['flower','fresh','cookie','lifestyle','upliftroom']::text[],NULL,'$60–$340','[{"size": "3.5g", "price": 60.0, "unit": "gram"}, {"size": "7g", "price": 114.0, "unit": "gram"}, {"size": "14g", "price": 216.0, "unit": "gram"}, {"size": "28g", "price": 340.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Cereal Milk','cereal-milk',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','moderate',ARRAY['social','calm']::text[],ARRAY['flower','fresh','cereal','lifestyle','upliftroom']::text[],NULL,'$60–$340','[{"size": "3.5g", "price": 60.0, "unit": "gram"}, {"size": "7g", "price": 114.0, "unit": "gram"}, {"size": "14g", "price": 216.0, "unit": "gram"}, {"size": "28g", "price": 340.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Sour Joker','sour-joker',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','moderate',ARRAY['social','calm']::text[],ARRAY['flower','fresh','lifestyle','upliftroom']::text[],NULL,'$60–$340','[{"size": "3.5g", "price": 60.0, "unit": "gram"}, {"size": "7g", "price": 114.0, "unit": "gram"}, {"size": "14g", "price": 216.0, "unit": "gram"}, {"size": "28g", "price": 340.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Nerds Clusters','nerds-clusters',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','moderate',ARRAY['social','calm']::text[],ARRAY['flower','fresh','nerds','lifestyle','upliftroom']::text[],NULL,'$60–$340','[{"size": "3.5g", "price": 60.0, "unit": "gram"}, {"size": "7g", "price": 114.0, "unit": "gram"}, {"size": "14g", "price": 216.0, "unit": "gram"}, {"size": "28g", "price": 340.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Riot Runtz','riot-runtz',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','moderate',ARRAY['social','calm']::text[],ARRAY['flower','fresh','lifestyle','upliftroom']::text[],NULL,'$60–$340','[{"size": "3.5g", "price": 60.0, "unit": "gram"}, {"size": "7g", "price": 114.0, "unit": "gram"}, {"size": "14g", "price": 216.0, "unit": "gram"}, {"size": "28g", "price": 340.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Blue Steel','blue-steel',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','moderate',ARRAY['social','calm']::text[],ARRAY['flower','fresh','lifestyle','upliftroom']::text[],NULL,'$60–$340','[{"size": "3.5g", "price": 60.0, "unit": "gram"}, {"size": "7g", "price": 114.0, "unit": "gram"}, {"size": "14g", "price": 216.0, "unit": "gram"}, {"size": "28g", "price": 340.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Violet Sky','violet-sky',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','moderate',ARRAY['social','calm']::text[],ARRAY['flower','fresh','lifestyle','upliftroom']::text[],NULL,'$60–$340','[{"size": "3.5g", "price": 60.0, "unit": "gram"}, {"size": "7g", "price": 114.0, "unit": "gram"}, {"size": "14g", "price": 216.0, "unit": "gram"}, {"size": "28g", "price": 340.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Banana Hammock','banana-hammock',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a slow-it-down, cozy night vibe. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a slow-it-down, cozy night vibe. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','night','moderate',ARRAY['unwind','calm']::text[],ARRAY['flower','fresh','banana','lifestyle','upliftroom']::text[],NULL,'$50–$280','[{"size": "3.5g", "price": 50.0, "unit": "gram"}, {"size": "7g", "price": 95.0, "unit": "gram"}, {"size": "14g", "price": 180.0, "unit": "gram"}, {"size": "28g", "price": 280.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),

    ('Boring Slabs Shatter','boring-slabs-shatter',(SELECT id FROM categories WHERE slug='concentrates'),'Clean concentrate with a steady, in-the-middle feel. Rich flavor and big intensity—pace yourself.','Clean concentrate with a steady, in-the-middle feel. Rich flavor and big intensity—pace yourself.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','strong',ARRAY['social','calm','unwind']::text[],ARRAY['concentrate','extract','shatter','lifestyle','upliftroom']::text[],NULL,'$40–$400','[{"size": "1g", "price": 40.0, "unit": "gram"}, {"size": "2g", "price": 76.0, "unit": "gram"}, {"size": "3.5g", "price": 400.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,78.0,0.1,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('WHOLE MELT Sugar Diamonds – CRUMBLE','whole-melt-sugar-diamonds-crumble',(SELECT id FROM categories WHERE slug='concentrates'),'Clean concentrate with a steady, in-the-middle feel. Rich flavor and big intensity—pace yourself.','Clean concentrate with a steady, in-the-middle feel. Rich flavor and big intensity—pace yourself.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','strong',ARRAY['social','calm','unwind']::text[],ARRAY['concentrate','extract','diamonds','crumble','lifestyle','upliftroom']::text[],NULL,'$40–$400','[{"size": "1g", "price": 40.0, "unit": "gram"}, {"size": "2g", "price": 76.0, "unit": "gram"}, {"size": "3.5g", "price": 400.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,78.0,0.1,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Holiday Box – Christmas Edition','holiday-box-christmas-edition',(SELECT id FROM categories WHERE slug='concentrates'),'Clean concentrate with a slow-it-down, cozy night vibe. Rich flavor and big intensity—pace yourself.','Clean concentrate with a slow-it-down, cozy night vibe. Rich flavor and big intensity—pace yourself.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','night','strong',ARRAY['unwind','calm']::text[],ARRAY['concentrate','extract','lifestyle','upliftroom']::text[],180.0,'$180','[{"size": "unit", "price": 180.0, "unit": "item"}]'::jsonb,NULL,NULL,NULL,78.0,0.1,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Moonrocks','moonrocks',(SELECT id FROM categories WHERE slug='concentrates'),'Clean concentrate with a slow-it-down, cozy night vibe. Rich flavor and big intensity—pace yourself.','Clean concentrate with a slow-it-down, cozy night vibe. Rich flavor and big intensity—pace yourself.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','night','bold',ARRAY['unwind','calm']::text[],ARRAY['concentrate','extract','moonrocks','lifestyle','upliftroom']::text[],NULL,'$80–$200','[{"size": "1g", "price": 80.0, "unit": "gram"}, {"size": "2g", "price": 152.0, "unit": "gram"}, {"size": "3.5g", "price": 200.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,78.0,0.1,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),

    ('Blue Steel','blue-steel-sale',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a steady, in-the-middle feel. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','moderate',ARRAY['social','calm']::text[],ARRAY['flower','fresh','sale','lifestyle','upliftroom']::text[],NULL,'$60–$340','[{"size": "3.5g", "price": 60.0, "unit": "gram"}, {"size": "7g", "price": 114.0, "unit": "gram"}, {"size": "14g", "price": 216.0, "unit": "gram"}, {"size": "28g", "price": 340.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Boutiq Switch Liquid Live Diamonds 2 g Disposable Cart','boutiq-switch-liquid-live-diamonds-2-g-disposable-cart-sale',(SELECT id FROM categories WHERE slug='vapes'),'Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.','Smooth pull, steady, in-the-middle feel. Built for quick, consistent sessions—keep it simple and keep it moving.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','balanced','bold',ARRAY['social','calm','unwind']::text[],ARRAY['vape','cartridge','diamonds','sale','lifestyle','upliftroom']::text[],80.0,'$80','[{"size": "2g", "price": 80.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,88.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Banana Hammock','banana-hammock-sale',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a slow-it-down, cozy night vibe. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a slow-it-down, cozy night vibe. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','night','moderate',ARRAY['unwind','calm']::text[],ARRAY['flower','fresh','banana','sale','lifestyle','upliftroom']::text[],NULL,'$50–$280','[{"size": "3.5g", "price": 50.0, "unit": "gram"}, {"size": "7g", "price": 95.0, "unit": "gram"}, {"size": "14g", "price": 180.0, "unit": "gram"}, {"size": "28g", "price": 280.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,24.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('PERSY Snow Balls','persy-snow-balls-sale',(SELECT id FROM categories WHERE slug='flower'),'Premium flower with a slow-it-down, cozy night vibe. Aromatic, loud, and lounge-friendly—start low, go slow.','Premium flower with a slow-it-down, cozy night vibe. Aromatic, loud, and lounge-friendly—start low, go slow.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','night','bold',ARRAY['unwind','calm']::text[],ARRAY['flower','fresh','sale','lifestyle','upliftroom']::text[],NULL,'$350–$600','[{"size": "3.5g", "price": 350.0, "unit": "gram"}, {"size": "7g", "price": 665.0, "unit": "gram"}, {"size": "14g", "price": 1260.0, "unit": "gram"}, {"size": "28g", "price": 600.0, "unit": "gram"}]'::jsonb,NULL,NULL,NULL,30.0,0.2,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),

    ('Buy Weed From Women Hoodie','buy-weed-from-women-hoodie',(SELECT id FROM categories WHERE slug='accessories'),'Streetwear-level merch for the Uplift Room lifestyle. Simple, clean, and built for everyday rotation.','Streetwear-level merch for the Uplift Room lifestyle. Simple, clean, and built for everyday rotation.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','anytime','light',ARRAY['social','calm']::text[],ARRAY['merch','apparel','hoodie','lifestyle','upliftroom']::text[],40.0,'$40','[{"size": "one size", "price": 40.0, "unit": "item"}]'::jsonb,NULL,NULL,NULL,NULL,NULL,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Light My Fire Hoodie','light-my-fire-hoodie',(SELECT id FROM categories WHERE slug='accessories'),'Streetwear-level merch for the Uplift Room lifestyle. Simple, clean, and built for everyday rotation.','Streetwear-level merch for the Uplift Room lifestyle. Simple, clean, and built for everyday rotation.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','anytime','light',ARRAY['social','calm']::text[],ARRAY['merch','apparel','hoodie','lifestyle','upliftroom']::text[],40.0,'$40','[{"size": "one size", "price": 40.0, "unit": "item"}]'::jsonb,NULL,NULL,NULL,NULL,NULL,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Astrology Hoodie','astrology-hoodie',(SELECT id FROM categories WHERE slug='accessories'),'Streetwear-level merch for the Uplift Room lifestyle. Simple, clean, and built for everyday rotation.','Streetwear-level merch for the Uplift Room lifestyle. Simple, clean, and built for everyday rotation.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','anytime','light',ARRAY['social','calm']::text[],ARRAY['merch','apparel','hoodie','lifestyle','upliftroom']::text[],40.0,'$40','[{"size": "one size", "price": 40.0, "unit": "item"}]'::jsonb,NULL,NULL,NULL,NULL,NULL,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('“God Forgives, I Don’t” Hoodie','god-forgives-i-dont-hoodie',(SELECT id FROM categories WHERE slug='accessories'),'Streetwear-level merch for the Uplift Room lifestyle. Simple, clean, and built for everyday rotation.','Streetwear-level merch for the Uplift Room lifestyle. Simple, clean, and built for everyday rotation.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','anytime','light',ARRAY['social','calm']::text[],ARRAY['merch','apparel','hoodie','lifestyle','upliftroom']::text[],40.0,'$40','[{"size": "one size", "price": 40.0, "unit": "item"}]'::jsonb,NULL,NULL,NULL,NULL,NULL,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Purple Penthouse Dad Hat','purple-penthouse-dad-hat',(SELECT id FROM categories WHERE slug='accessories'),'Streetwear-level merch for the Uplift Room lifestyle. Simple, clean, and built for everyday rotation.','Streetwear-level merch for the Uplift Room lifestyle. Simple, clean, and built for everyday rotation.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','anytime','light',ARRAY['social','calm']::text[],ARRAY['merch','apparel','hat','lifestyle','upliftroom']::text[],60.0,'$60','[{"size": "one size", "price": 60.0, "unit": "item"}]'::jsonb,NULL,NULL,NULL,NULL,NULL,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Stack Chips Laundry Service Hoodie','stack-chips-laundry-service-hoodie',(SELECT id FROM categories WHERE slug='accessories'),'Streetwear-level merch for the Uplift Room lifestyle. Simple, clean, and built for everyday rotation.','Streetwear-level merch for the Uplift Room lifestyle. Simple, clean, and built for everyday rotation.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','anytime','light',ARRAY['social','calm']::text[],ARRAY['merch','apparel','hoodie','lifestyle','upliftroom']::text[],40.0,'$40','[{"size": "one size", "price": 40.0, "unit": "item"}]'::jsonb,NULL,NULL,NULL,NULL,NULL,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0),
    ('Look In Mirror Hoodie','look-in-mirror-hoodie',(SELECT id FROM categories WHERE slug='accessories'),'Streetwear-level merch for the Uplift Room lifestyle. Simple, clean, and built for everyday rotation.','Streetwear-level merch for the Uplift Room lifestyle. Simple, clean, and built for everyday rotation.

**Notes:** Effects vary by person. Start low, go slow. No online sales.','anytime','light',ARRAY['social','calm']::text[],ARRAY['merch','apparel','hoodie','lifestyle','upliftroom']::text[],40.0,'$40','[{"size": "one size", "price": 40.0, "unit": "item"}]'::jsonb,NULL,NULL,NULL,NULL,NULL,ARRAY['Adults only where applicable','Do not drive or operate machinery after use','Keep out of reach of children']::text[],TRUE,FALSE,0)

) AS v(
  name,
  slug,
  category_id,
  short_description,
  long_description,
  profile,
  intensity,
  experience_notes,
  tags,
  base_price,
  price_text,
  sizes,
  image_cover_path,
  image_gallery_paths,
  lab_report_url,
  thc_percentage,
  cbd_percentage,
  content_warnings,
  is_active,
  is_featured,
  sort_order
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  profile = EXCLUDED.profile,
  intensity = EXCLUDED.intensity,
  experience_notes = EXCLUDED.experience_notes,
  tags = EXCLUDED.tags,
  base_price = EXCLUDED.base_price,
  price_text = EXCLUDED.price_text,
  sizes = EXCLUDED.sizes,
  lab_report_url = EXCLUDED.lab_report_url,
  thc_percentage = EXCLUDED.thc_percentage,
  cbd_percentage = EXCLUDED.cbd_percentage,
  content_warnings = EXCLUDED.content_warnings,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();
