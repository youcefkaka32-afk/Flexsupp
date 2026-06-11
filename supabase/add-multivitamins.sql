-- Add Multivitamins category
INSERT INTO categories (id, name, slug, description)
VALUES ('multivitamins', 'Multivitamins', 'multivitamins', 'Essential vitamins and minerals for overall health and performance')
ON CONFLICT (id) DO NOTHING;
