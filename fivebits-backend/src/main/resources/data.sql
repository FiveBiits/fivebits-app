-- Seed Sri Lankan universities (runs on startup with spring.jpa.defer-datasource-initialization=true)
-- Uses a safe INSERT that skips if data already exists
INSERT INTO universities (name, latitude, longitude)
SELECT name, latitude, longitude FROM (VALUES
  ('University of Moratuwa', 6.7952, 79.9009),
  ('University of Colombo', 6.9009, 79.8600),
  ('University of Peradeniya', 7.2539, 80.5970),
  ('University of Kelaniya', 6.9734, 79.9146),
  ('University of Sri Jayewardenepura', 6.8529, 79.9027),
  ('University of Jaffna', 9.6833, 80.0108),
  ('University of Ruhuna', 6.0730, 80.5580),
  ('Eastern University Sri Lanka', 7.7167, 81.6997),
  ('South Eastern University', 7.3382, 81.8219),
  ('Rajarata University', 8.3508, 80.3847),
  ('Sabaragamuwa University', 6.7108, 80.7862),
  ('Wayamba University', 7.4836, 80.3672),
  ('Uva Wellassa University', 6.9839, 81.0764),
  ('University of the Visual & Performing Arts', 6.9167, 79.8611),
  ('Open University of Sri Lanka', 6.8820, 79.8876),
  ('General Sir John Kotelawala Defence University', 6.8173, 79.9594),
  ('Sri Lanka Institute of Information Technology (SLIIT)', 6.9140, 79.9724),
  ('Informatics Institute of Technology (IIT)', 6.9088, 79.8523),
  ('NSBM Green University', 6.8400, 80.0372),
  ('Sri Lanka Technological Campus (SLTC)', 6.7912, 80.0478)
) AS v(name, latitude, longitude)
WHERE NOT EXISTS (SELECT 1 FROM universities LIMIT 1);
