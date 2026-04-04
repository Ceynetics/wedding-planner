CREATE TABLE vendors (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(15) NOT NULL,
    rating DOUBLE PRECISION,
    review_count INTEGER,
    image_url VARCHAR(500),
    price DECIMAL(12, 2),
    description VARCHAR(1000),
    address VARCHAR(255),
    email VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE vendor_services (
    vendor_id BIGINT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    service_name VARCHAR(100) NOT NULL
);

CREATE INDEX idx_vendors_category ON vendors(category);
CREATE INDEX idx_vendors_name ON vendors(name);
CREATE INDEX idx_vendor_services_vendor ON vendor_services(vendor_id);

-- Seed data: sample wedding vendors
INSERT INTO vendors (name, category, rating, review_count, price, description, address, email, phone) VALUES
('Lumina Studios', 'PHOTOGRAPHY', 4.8, 124, 3500.00, 'Award-winning wedding photography and videography studio specializing in candid and cinematic styles.', '42 Arts District, Downtown', 'hello@luminastudios.com', '+1-555-0101'),
('Grand Ballroom Hotel', 'VENUE', 4.9, 89, 15000.00, 'Elegant ballroom venue with capacity for up to 500 guests, full catering services, and on-site event coordination.', '1 Grand Avenue, Midtown', 'events@grandballroom.com', '+1-555-0102'),
('Petals & Stems', 'FLORIST', 4.7, 76, 2500.00, 'Bespoke floral design for weddings. From bouquets to centerpieces, creating stunning arrangements with seasonal blooms.', '18 Garden Row', 'info@petalsandstems.com', '+1-555-0103'),
('Savory Bites Catering', 'CATERING', 4.6, 153, 8000.00, 'Premium wedding catering with customizable menus. Specializing in multi-cuisine buffets and plated dinners.', '55 Food Court Lane', 'catering@savorybites.com', '+1-555-0104'),
('Harmony Strings', 'MUSIC', 4.9, 67, 2000.00, 'Live string quartet and DJ services for ceremonies and receptions. Classical, jazz, and contemporary repertoire.', '7 Music Hall, Arts Quarter', 'book@harmonystrings.com', '+1-555-0105'),
('Enchanted Events Decor', 'DECOR', 4.5, 92, 5000.00, 'Full venue transformation with themed decor packages. Lighting, draping, table settings, and custom installations.', '33 Design Boulevard', 'hello@enchantedecor.com', '+1-555-0106'),
('Sunset Ridge Winery', 'VENUE', 4.8, 45, 12000.00, 'Picturesque vineyard venue with outdoor ceremony spaces, barrel room reception, and award-winning wines.', '200 Vineyard Road, Wine Country', 'events@sunsetridge.com', '+1-555-0107'),
('Frame Perfect Films', 'PHOTOGRAPHY', 4.7, 98, 4500.00, 'Cinematic wedding films and documentary-style photography. Drone coverage and same-day edits available.', '12 Studio Lane', 'info@frameperfect.com', '+1-555-0108'),
('The Cake Atelier', 'CATERING', 4.9, 134, 1500.00, 'Custom wedding cakes and dessert tables. Fondant, buttercream, and modern minimalist designs.', '8 Pastry Street', 'orders@cakeatelier.com', '+1-555-0109'),
('Bloom & Wild Florals', 'FLORIST', 4.6, 58, 3000.00, 'Eco-friendly floral design using locally sourced and seasonal flowers. Bohemian and garden-style specialists.', '22 Green Lane', 'hello@bloomandwild.com', '+1-555-0110');

-- Seed vendor services
INSERT INTO vendor_services (vendor_id, service_name) VALUES
(1, 'Wedding Photography'), (1, 'Engagement Shoots'), (1, 'Photo Albums'), (1, 'Videography'),
(2, 'Indoor Reception'), (2, 'Outdoor Ceremony'), (2, 'Catering'), (2, 'Event Coordination'),
(3, 'Bridal Bouquets'), (3, 'Centerpieces'), (3, 'Ceremony Arches'), (3, 'Boutonnieres'),
(4, 'Buffet Service'), (4, 'Plated Dinner'), (4, 'Cocktail Hour'), (4, 'Bar Service'),
(5, 'Ceremony Music'), (5, 'Reception DJ'), (5, 'String Quartet'), (5, 'Band'),
(6, 'Venue Draping'), (6, 'Lighting Design'), (6, 'Table Settings'), (6, 'Custom Installations'),
(7, 'Outdoor Ceremony'), (7, 'Barrel Room Reception'), (7, 'Wine Tasting'), (7, 'Accommodation'),
(8, 'Cinematic Films'), (8, 'Documentary Style'), (8, 'Drone Coverage'), (8, 'Same-Day Edits'),
(9, 'Custom Cakes'), (9, 'Dessert Tables'), (9, 'Cake Tasting'), (9, 'Delivery & Setup'),
(10, 'Bridal Bouquets'), (10, 'Church Flowers'), (10, 'Reception Florals'), (10, 'Sustainable Design');
