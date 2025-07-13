-- Supabase Database Schema for Lesson Plan App
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
-- create secret in sql editor by running this line
-- SELECT encode(gen_random_bytes(32), 'hex');
-- copy the 32 char output and replace in the next line
-- ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-generated-secret';
-- little bit of this little bit 2La8 --
ALTER DATABASE postgres SET "app.jwt_secret" TO '2a9bf53c8d4e7782bdf67bade9a4e5c40c31524db311689b758eda30fbba6d8a';
-- Users table with privacy-focused design
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    display_id VARCHAR(8) UNIQUE NOT NULL, -- ABC123XY format
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('teacher', 'student', 'admin')),
    class_code VARCHAR(3), -- For students: ABC part of display_id
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- User profiles for additional info
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100), -- "Student A", "Teacher Smith"
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classes table for organizing students
CREATE TABLE IF NOT EXISTS classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    class_code VARCHAR(3) UNIQUE NOT NULL, -- ABC
    class_name VARCHAR(100) NOT NULL,
    teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    max_students INTEGER DEFAULT 26,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_display_id ON users(display_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_class_code ON users(class_code);
CREATE INDEX IF NOT EXISTS idx_classes_code ON classes(class_code);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);

-- Function to generate display IDs
CREATE OR REPLACE FUNCTION generate_display_id(user_role TEXT, class_code TEXT DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    prefix TEXT;
    suffix TEXT;
    counter INTEGER;
    new_id TEXT;
BEGIN
    -- Generate random 5-character alphanumeric suffix
    suffix := upper(
        substr(md5(random()::text || clock_timestamp()::text), 1, 2) ||
        lpad((floor(random() * 999) + 1)::text, 3, '0')
    );
    
    IF user_role = 'teacher' THEN
        prefix := 'TCH';
    ELSIF user_role = 'student' AND class_code IS NOT NULL THEN
        prefix := upper(class_code);
    ELSE
        prefix := 'USR'; -- fallback
    END IF;
    
    new_id := prefix || suffix;
    
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM users WHERE display_id = new_id) LOOP
        suffix := upper(
            substr(md5(random()::text || clock_timestamp()::text), 1, 2) ||
            lpad((floor(random() * 999) + 1)::text, 3, '0')
        );
        new_id := prefix || suffix;
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create class code
CREATE OR REPLACE FUNCTION generate_class_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
BEGIN
    -- Generate 3-letter class code
    new_code := upper(
        chr(65 + floor(random() * 26)::int) ||
        chr(65 + floor(random() * 26)::int) ||
        chr(65 + floor(random() * 26)::int)
    );
    
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM classes WHERE class_code = new_code) LOOP
        new_code := upper(
            chr(65 + floor(random() * 26)::int) ||
            chr(65 + floor(random() * 26)::int) ||
            chr(65 + floor(random() * 26)::int)
        );
    END LOOP;
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Teachers can see students in their classes
CREATE POLICY "Teachers can view their students" ON users
    FOR SELECT USING (
        role = 'student' AND 
        class_code IN (
            SELECT class_code FROM classes 
            WHERE teacher_id = auth.uid()
        )
    );

-- Profile policies
CREATE POLICY "Users can view own profile details" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile details" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Class policies
CREATE POLICY "Teachers can manage their classes" ON classes
    FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view their class info" ON classes
    FOR SELECT USING (
        class_code IN (
            SELECT class_code FROM users 
            WHERE id = auth.uid()
        )
    );

-- Trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
