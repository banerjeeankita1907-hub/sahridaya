/*
  # Create Sanskrit E-Reader Database Schema

  1. New Tables
    - `texts`: Stores Sanskrit literary works (kāvya)
      - `id` (uuid, primary key)
      - `title` (text, not null) - Title of the work in Devanāgarī
      - `title_latin` (text) - Transliterated title
      - `author` (text) - Author name
      - `author_latin` (text) - Transliterated author name
      - `era` (text) - Historical period (e.g., "Classical", "Vedic")
      - `description` (text) - Brief description
      - `cover_image` (text) - URL to cover image
      - `total_verses` (integer) - Number of verses
      - `created_at` (timestamptz)

    - `cantos`: Divisions within a text (sarga/canto)
      - `id` (uuid, primary key)
      - `text_id` (uuid, foreign key to texts)
      - `canto_number` (integer, not null)
      - `title` (text) - Canto title
      - `title_latin` (text) - Transliterated title
      - `created_at` (timestamptz)

    - `verses`: Individual verses (śloka/pāda)
      - `id` (uuid, primary key)
      - `canto_id` (uuid, foreign key to cantos)
      - `verse_number` (integer, not null)
      - `text_devanagari` (text, not null) - Verse in Devanāgarī script
      - `text_iast` (text) - Verse in IAST transliteration
      - `meter` (text) - Metre name (chandas)
      - `meter_type` (text) - Type of metre (e.g., "anuṣṭubh", "śārdūlavikrīḍita")
      - `translation_en` (text) - English translation
      - `created_at` (timestamptz)

    - `annotations`: Alaṃkāra annotations for verses
      - `id` (uuid, primary key)
      - `verse_id` (uuid, foreign key to verses)
      - `alankara_type` (text, not null) - "upama" or "utpreksha"
      - `sub_type` (text) - Detailed sub-type (e.g., "purna", "lupta_dharma")
      - `full_tag` (text) - Full classification tag (e.g., "Upamā:Pūrṇā")
      - `upameya` (text) - Subject of comparison
      - `upamana` (text) - Object of comparison
      - `sadharana_dharma` (text) - Common attribute
      - `vacaka` (text) - Comparative marker word
      - `explanation` (text) - Human-readable explanation
      - `confidence` (numeric) - Detection confidence 0-1
      - `highlight_start` (integer) - Start position in verse text
      - `highlight_end` (integer) - End position in verse text
      - `created_at` (timestamptz)

    - `word_glosses`: Per-word morphological annotations
      - `id` (uuid, primary key)
      - `verse_id` (uuid, foreign key to verses)
      - `word_index` (integer, not null) - Position of word in verse
      - `word_form` (text, not null) - The inflected form
      - `lemma` (text) - Root/dictionary form
      - `pos_tag` (text) - Part of speech
      - `morphology` (text) - Morphological features (gender, case, number, etc.)
      - `meaning` (text) - English gloss
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for all tables (Sanskrit texts are public knowledge)
    - No insert/update/delete policies (data managed via admin/migrations)
*/

-- Create texts table
CREATE TABLE IF NOT EXISTS texts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_latin text DEFAULT '',
  author text DEFAULT '',
  author_latin text DEFAULT '',
  era text DEFAULT '',
  description text DEFAULT '',
  cover_image text DEFAULT '',
  total_verses integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create cantos table
CREATE TABLE IF NOT EXISTS cantos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text_id uuid NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
  canto_number integer NOT NULL,
  title text DEFAULT '',
  title_latin text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create verses table
CREATE TABLE IF NOT EXISTS verses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  canto_id uuid NOT NULL REFERENCES cantos(id) ON DELETE CASCADE,
  verse_number integer NOT NULL,
  text_devanagari text NOT NULL,
  text_iast text DEFAULT '',
  meter text DEFAULT '',
  meter_type text DEFAULT '',
  translation_en text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create annotations table
CREATE TABLE IF NOT EXISTS annotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verse_id uuid NOT NULL REFERENCES verses(id) ON DELETE CASCADE,
  alankara_type text NOT NULL,
  sub_type text DEFAULT '',
  full_tag text NOT NULL,
  upameya text DEFAULT '',
  upamana text DEFAULT '',
  sadharana_dharma text DEFAULT '',
  vacaka text DEFAULT '',
  explanation text DEFAULT '',
  confidence numeric DEFAULT 0.0,
  highlight_start integer DEFAULT 0,
  highlight_end integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create word_glosses table
CREATE TABLE IF NOT EXISTS word_glosses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verse_id uuid NOT NULL REFERENCES verses(id) ON DELETE CASCADE,
  word_index integer NOT NULL,
  word_form text NOT NULL,
  lemma text DEFAULT '',
  pos_tag text DEFAULT '',
  morphology text DEFAULT '',
  meaning text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cantos ENABLE ROW LEVEL SECURITY;
ALTER TABLE verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_glosses ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read texts"
  ON texts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read cantos"
  ON cantos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read verses"
  ON verses FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read annotations"
  ON annotations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read word_glosses"
  ON word_glosses FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_cantos_text_id ON cantos(text_id);
CREATE INDEX IF NOT EXISTS idx_verses_canto_id ON verses(canto_id);
CREATE INDEX IF NOT EXISTS idx_annotations_verse_id ON annotations(verse_id);
CREATE INDEX IF NOT EXISTS idx_annotations_alankara_type ON annotations(alankara_type);
CREATE INDEX IF NOT EXISTS idx_word_glosses_verse_id ON word_glosses(verse_id);
