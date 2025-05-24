CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  profile_photo LONGBLOB DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS videos (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255),
  description TEXT,
  video_data MEDIUMBLOB NOT NULL,
  video_mime VARCHAR(50) NOT NULL,
  thumbnail_url TEXT,
  duration INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS likes (
  user_id VARCHAR(36),
  video_id VARCHAR(36),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, video_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (video_id) REFERENCES videos(id)
);
CREATE TABLE IF NOT EXISTS comments (
  id VARCHAR(36) PRIMARY KEY,
  video_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id VARCHAR(36) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (parent_comment_id) REFERENCES comments(id)
);

INSERT INTO users (id, username, email, password, profile_photo, created_at)
VALUES (
  'user-001',
  'admin',
  'admin@example.com',
  '$2b$10$h3o/LOU.UPwu515rUjjX7O/wLdxL58kh1fTDAkJmnNEq.DfjhfjkK',
  NULL,
  NOW()
);

SET @admin_user_id = LAST_INSERT_ID();

-- OPTIONAL: insert a placeholder video owned by admin (can be skipped)
INSERT INTO videos (
  id, user_id, title, description, video_data, video_mime, thumbnail_url, duration, created_at
)
VALUES (
  'video-001',
  @admin_user_id,
  'Placeholder Video',
  'This is a placeholder video for testing.',
  '',                   
  'video/mp4',
  NULL,
  0,
  NOW()
);
