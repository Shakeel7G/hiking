CREATE DATABASE IF NOT EXISTS into_the_land;
USE into_the_land;

-- -- -- -- -- -- -- -- -- -- --
-- Avelile --
-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  surname VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,  -- still hashed with bcrypt
  role ENUM('customer', 'admin') DEFAULT 'customer'
);

-- Areas table
CREATE TABLE areas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);

-- Trails table
CREATE TABLE trails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    area_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty ENUM('Easy', 'Moderate', 'Hard', 'Expert') NOT NULL,
    FOREIGN KEY (area_id) REFERENCES areas(id)
);

-- Bookings table
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  trail_id INT NOT NULL,
  hike_date DATE NOT NULL,
  hike_time VARCHAR(50) NOT NULL,
  adults INT NOT NULL,
  kids INT NOT NULL DEFAULT 0,
  hike_and_bite INT DEFAULT 0,
  photography_option VARCHAR(10) DEFAULT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (trail_id) REFERENCES trails(id)
);

-- Payments table
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending',
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);



-- Messages table
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(100),
  email VARCHAR(100),
  message TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- -- -- -- -- -- -- -- -- -- --
-- Shakeel --
-- Showing databases and tables
SHOW DATABASES;
USE into_the_land;

-- Insert areas
INSERT INTO areas (id, name, description) VALUES
(1, 'Cape Town', 'Scenic city surrounded by mountains and oceans, offering diverse hiking experiences.'),
(2, 'Stellenbosch', 'Wine region with beautiful mountain trails and waterfalls.'),
(3, 'Cederberg', 'Rugged wilderness area known for dramatic rock formations.'),
(4, 'Overberg', 'Coastal and mountain region with diverse flora and whale watching.'),
(5, 'Drakensberg', 'Majestic mountain range with spectacular hiking trails.');
-- Insert Cape Town trails (area_id = 1)
INSERT INTO trails (area_id, title, image_url, description, difficulty) VALUES
(1, 'Table Mountain – Platteklip retest', '/images/imgPlatteklip.jpg', 'A steep, direct hike to the summit. Not ideal for small kids.', 'Hard'),
(1, 'Table Mountain – Skeleton Gorge to Maclear’s Beacon', '/images/imgSkeletongorge.jpg', 'Scenic forested trail to Table Mountain''s highest point. Challenging. Teens and up.', 'Hard'),
(1, 'Table Mountain – India Venster', '/images/imgIndiavenster.jpg', 'Exciting scramble route. Not for beginners or young children.', 'Expert'),
(1, 'Table Mountain – Constantia Nek to Kirstenbosch', '/images/imgConstantiaNek.jpg', 'Family-friendly hike ending in beautiful botanical gardens.', 'Moderate'),
(1, 'Table Mountain – Nursery Ravine', '/images/imgNurseryRavine.jpg', 'Shady forest ascent. Steep in places. Teens and fit kids can manage.', 'Moderate'),
(1, 'Lion’s Head Loop', '/images/imgLionsHead.jpg', '360° views from the summit. Popular with locals.', 'Moderate'),
(1, 'Devil’s Peak Trail', '/images/imgDevilsPeak.jpg', 'Challenging hike with rewarding views. Not recommended for children.', 'Hard'),
(1, 'Pipe Track Trail', '/images/imgPipeTrack.jpg', 'Flat, easy walk along the base of Table Mountain. Great for families.', 'Easy'),
(1, 'Kasteelspoort Trail', '/images/imgKasteelspoort.jpg', 'A stunning route to the back of Table Mountain. Safe for older kids.', 'Moderate'),
(1, 'Tranquility Cracks Trail', '/images/imgTranquilityCracks.jpg', 'Hidden rock formations. Fun for adventurous kids and adults.', 'Moderate'),
(1, 'Silvermine Nature Reserve – Elephant’s Eye', '/images/imgElephantsEye.jpg', 'Gentle hike to a cave. Great for beginners and families.', 'Easy'),
(1, 'Silvermine – Noordhoek Peak Trail', '/images/imgNoordhoekPeak.jpg', 'Summit hike with panoramic views. Suitable for active families.', 'Moderate'),
(1, 'Chapman’s Peak Trail', '/images/imgChapmansPeakTrail.jpg', 'Scenic coastal hike. Ideal for photography lovers.', 'Moderate'),
(1, 'Chapman’s Peak to Noordhoek Loop', '/images/imgNoordhoekLoop.jpeg', 'Circular route with sea and mountain views. Safe for older kids.', 'Moderate'),
(1, 'Slangkop Lighthouse to Kommetjie Beach Trail', '/images/imgSlangkopLighthouseToKommetjieBeachTrail.jpg', 'Beachfront trail. Great for kids and leashed dogs.', 'Easy'),
(1, 'Cape of Good Hope – Shipwreck Trail', '/images/imgCapeOfGoodHopeShipwreckTrail.jpg', 'Flat coastal walk past historic wrecks. Family-friendly.', 'Easy'),
(1, 'Cape of Good Hope – Kanonkop Trail', '/images/imgCapeOfGoodHopeKanonkopTrail.jpg', 'Historic cannon viewpoint. Ideal for nature lovers.', 'Moderate'),
(1, 'Cape of Good Hope – Cape Point Lighthouse Trail', '/images/imgCapeOfGoodHopeCapePointLighthouseTrail.jpeg', 'Short, steep walk to iconic lighthouse. Paved. Family-friendly.', 'Easy'),
(1, 'Karbonkelberg Trail (Hout Bay)', '/images/imgKarbonkelbergTrail.jpg', 'Rugged coastal hike. Not recommended for children.', 'Hard'),
(1, 'Constantia Greenbelt Trail', '/images/imgConstantiaGreenbeltTrail.jpeg', 'Leafy urban trail. Great for dogs and kids.', 'Easy'),
(1, 'Cecilia Forest Waterfall Trail', '/images/imgCeciliaForestWaterfallTrail.jpeg', 'Shaded forest walk to a small waterfall. Safe for kids.', 'Easy'),
(1, 'Newlands Forest Contour Path', '/images/imgNewlandsForestContourPath.jpeg', 'Contoured forest walk. Family-friendly. Gentle terrain.', 'Easy'),
(1, 'Deer Park Trail (Vredehoek)', '/images/imgDeerParkTrail.jpeg', 'Urban escape with city views. Great for dogs and children.', 'Easy');

-- Insert Stellenbosch trails (area_id = 2)
INSERT INTO trails (area_id, title, image_url, description, difficulty) VALUES
(2, 'Jonkershoek Panorama Trail', '/images/imgJonkershoekPanoramaTrail.jpeg', 'Steep circular mountain route. Older kids only.', 'Hard'),
(2, 'Jonkershoek Swartboskloof Trail', '/images/imgJonkershoekSwartboskloofTrail.jpeg', 'Scenic loop trail with waterfalls. Fit children can join.', 'Moderate'),
(2, 'Jonkershoek Tweede Waterval Trail', '/images/imgJonkershoekTweedeWatervalTrail.jpeg', 'Waterfall views. Great for families.', 'Moderate'),
(2, 'Mont Rochelle Nature Reserve – Perdekop Trail', '/images/imgMontRochelleNatureReservePerdekopTrail.jpeg', 'Summit trail with sweeping views.', 'Hard'),
(2, 'Mont Rochelle – Uitkyk Trail', '/images/imgMontRochelleUitkykTrail.jpeg', 'Gentle incline to a viewpoint. Good for fit kids.', 'Moderate'),
(2, 'Mont Rochelle – Du Toitskop Trail', '/images/imgMontRochelleDuToitskopTrail.jpeg', 'Steep trail to the peak. Not for beginners.', 'Expert'),
(2, 'Bainskloof Waterfall Trail', '/images/imgBainskloofWaterfallTrail.jpeg', 'Short trail to a waterfall. Family-friendly.', 'Easy'),
(2, 'Witzenberg Waterfall Trail', '/images/imgWitzenbergWaterfallTrail.jpeg', 'Scenic trail with falls and pools. Fun for kids.', 'Moderate'),
(2, 'Limietberg Nature Reserve – Rockhopper Trail', '/images/imgLimietbergNatureReserveRockhopperTrail.jpeg', 'Rocky terrain near river. Older children recommended.', 'Hard'),
(2, 'Limietberg – Bobbejaansrivier Trail', '/images/imgLimietbergBobbejaansrivierTrail.jpeg', 'Shaded trail with river crossings.', 'Moderate');

-- Insert Cederberg trails (area_id = 3)
INSERT INTO trails (area_id, title, image_url, description, difficulty) VALUES
(3, 'Cederberg Secrets – Wolfberg Cracks and Arch', '/images/imgCederbergSecretsWolfbergCracksandArch.jpeg', 'Adventure hike through rocky crevices. Not for small kids.', 'Hard'),
(3, 'Cederberg – Maltese Cross Trail', '/images/imgCederbergMalteseCrossTrail.jpg', 'Iconic rock formation. Family-friendly.', 'Moderate'),
(3, 'Cederberg – Lot''s Wife Trail', '/images/imgCederbergLotsWifeTrail.jpeg', 'Interesting rock columns. Teens and up.', 'Moderate'),
(3, 'Cederberg – Algeria Waterfall Trail', '/images/imgCederbergAlgeriaWaterfallTrail.jpeg', 'Short, forested trail to waterfall. Great for families.', 'Easy'),
(3, 'Cederberg – Tafelberg Summit Trail', '/images/imgCederbergTafelbergSummitTrail.jpeg', 'Challenging mountain climb. For experienced hikers only.', 'Expert'),
(3, 'Cederberg – Sneeuberg Trail', '/images/imgCederbergSneeubergTrail.jpeg', 'Cederberg''s highest peak. Great views for advanced hikers.', 'Expert');

-- Insert Overberg trails (area_id = 4)
INSERT INTO trails (area_id, title, image_url, description, difficulty) VALUES
(4, 'Crystal Pools Trail (Gordon’s Bay)', '/images/imgCrystalPoolsTrail.jpg', 'Popular summer hike. Moderate with some scrambling. Caution for kids.', 'Moderate'),
(4, 'Kogelberg Nature Reserve – Palmiet River Trail', '/images/imgKogelbergNatureReservePalmietRiverTrail.jpeg', 'Flat riverside trail. Great for families and birding.', 'Easy'),
(4, 'Kogelberg – Oudebosch to Harold Porter Trail', '/images/imgKogelbergOudeboschtoHaroldPorterTrail.jpeg', 'Fynbos trail linking two reserves. Kid-friendly.', 'Moderate'),
(4, 'Fernkloof Nature Reserve Trails (Hermanus)', '/images/imgFernkloofNatureReserveTrails.jpg', 'Network of trails with coastal views. Family suitable.', 'Moderate'),
(4, 'Walker Bay Coastal Trail', '/images/imgWalkerBayCoastalTrail.jpeg', 'Coastal dunes and beach trail. Kids should be supervised.', 'Moderate'),
(4, 'De Hoop Whale Trail (multi-day)', '/images/imgDeHoopWhaleTrail.jpg', 'Multi-day whale-watching trail. Not for young children.', 'Hard'),
(4, 'Rooiels to Kogel Bay Coastal Trail', '/images/imgRooielstoKogelBayCoastalTrail.jpeg', 'Wild coast route. Not recommended for small children.', 'Hard'),
(4, 'Betty’s Bay – Harold Porter Gardens Waterfall Trail', '/images/imgBettysBayHaroldPorterGardensWaterfallTrail.jpeg', 'Short, lush trail to waterfall. Good for kids.', 'Easy'),
(4, 'Helderberg Nature Reserve Trails', '/images/imgHelderbergNatureReserveTrails.jpeg', 'Several loops with wildlife. Family-friendly.', 'Easy');

-- Insert Drakensberg trails (area_id = 5)
INSERT INTO trails (area_id, title, image_url, description, difficulty) VALUES
(5, 'Drakensberg Escape', '/images/imgDrakensbergEscape.jpg', 'Iconic mountain hike. Only for experienced hikers.', 'Expert'),
(5, 'Groot Winterhoek Wilderness Area – De Tronk Trail', '/images/imgGrootWinterhoekWildernessAreaDeTronkTrail.jpeg', 'Wilderness trail through rugged terrain.', 'Hard'),
(5, 'Groot Winterhoek – Disa Pool Trail', '/images/imgGrootWinterhoekDisaPoolTrail.jpeg', 'Leads to natural pools. Safe for teens.', 'Moderate'),
(5, 'Boosmansbos Wilderness Area Trail (Langeberg)', '/images/imgBoosmansbosWildernessAreaTrail.jpeg', 'Multi-day wilderness trail. Recommended for experienced hikers.', 'Expert'),
(5, 'Swartberg Pass Circular Trail (Western edge)', '/images/imgSwartbergPassCircularTrail.jpeg', 'Historic pass with steep inclines.', 'Hard');


-- Add index for better performance
ALTER TABLE bookings ADD INDEX idx_user_date (user_id, hike_date);
ALTER TABLE bookings ADD INDEX idx_status (status);

-- Add to users table
ALTER TABLE users 
ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL,
ADD COLUMN reset_token_expiry DATETIME DEFAULT NULL;

-- Add index for better performance on reset tokens
ALTER TABLE users ADD INDEX idx_reset_token (reset_token);
ALTER TABLE users ADD INDEX idx_reset_token_expiry (reset_token_expiry);

SHOW TABLES;
