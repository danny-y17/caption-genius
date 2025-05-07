-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Subscription Plans
CREATE TABLE public.subscription_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    credits_per_month INTEGER NOT NULL,
    features JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User Profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    company_name TEXT,
    website TEXT,
    subscription_plan_id UUID REFERENCES public.subscription_plans(id),
    subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')),
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    credits_remaining INTEGER DEFAULT 0,
    credits_reset_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Niches/Categories
CREATE TABLE public.niches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Captions
CREATE TABLE public.captions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    niche_id UUID REFERENCES public.niches(id) NOT NULL,
    prompt TEXT NOT NULL,
    generated_caption TEXT NOT NULL,
    is_favorite BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tags for organizing captions
CREATE TABLE public.tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Caption Tags (junction table)
CREATE TABLE public.caption_tags (
    caption_id UUID REFERENCES public.captions(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (caption_id, tag_id)
);

-- Usage Tracking
CREATE TABLE public.usage_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    action_type TEXT NOT NULL,
    credits_used INTEGER NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Saved Templates
CREATE TABLE public.templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    prompt_template TEXT NOT NULL,
    variables JSONB,
    is_public BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- AI Configurations
CREATE TABLE public.ai_configurations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    purpose TEXT NOT NULL,
    tone TEXT NOT NULL,
    preferences TEXT NOT NULL,
    additional_traits TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Scheduled Posts
CREATE TABLE public.scheduled_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    caption_id UUID REFERENCES public.captions(id) NOT NULL,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    platform TEXT NOT NULL,
    status TEXT CHECK (status IN ('scheduled', 'published', 'failed', 'cancelled')) DEFAULT 'scheduled',
    content_type TEXT CHECK (content_type IN ('promotional', 'educational', 'entertaining', 'engagement')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.captions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.niches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caption_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Captions policies
CREATE POLICY "Users can view their own captions"
    ON public.captions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own captions"
    ON public.captions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own captions"
    ON public.captions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own captions"
    ON public.captions FOR DELETE
    USING (auth.uid() = user_id);

-- Niches policies
CREATE POLICY "Niches are viewable by everyone"
    ON public.niches FOR SELECT
    USING (true);

-- Tags policies
CREATE POLICY "Tags are viewable by everyone"
    ON public.tags FOR SELECT
    USING (true);

-- Usage logs policies
CREATE POLICY "Users can view their own usage logs"
    ON public.usage_logs FOR SELECT
    USING (auth.uid() = user_id);

-- Templates policies
CREATE POLICY "Users can view their own templates"
    ON public.templates FOR SELECT
    USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can manage their own templates"
    ON public.templates FOR ALL
    USING (auth.uid() = user_id);

-- AI Configurations policies
CREATE POLICY "Users can view their own AI configurations"
    ON public.ai_configurations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI configurations"
    ON public.ai_configurations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI configurations"
    ON public.ai_configurations FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI configurations"
    ON public.ai_configurations FOR DELETE
    USING (auth.uid() = user_id);

-- Scheduled posts policies
CREATE POLICY "Users can view their own scheduled posts"
    ON public.scheduled_posts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scheduled posts"
    ON public.scheduled_posts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled posts"
    ON public.scheduled_posts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled posts"
    ON public.scheduled_posts FOR DELETE
    USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Initial data
INSERT INTO public.subscription_plans (name, description, price, credits_per_month, features) VALUES
    ('Free', 'Basic access with limited credits', 0.00, 10, '{"features": ["Basic caption generation", "Limited niches"]}'),
    ('Pro', 'Full access with more credits', 19.99, 100, '{"features": ["All niches", "Priority support", "Custom templates"]}'),
    ('Business', 'Unlimited access for teams', 49.99, 500, '{"features": ["Team collaboration", "API access", "Custom branding"]}');

INSERT INTO public.niches (name, description) VALUES
    ('Yoga Studio', 'Captions for yoga studios and wellness centers'),
    ('Indie Coffee Shop', 'Captions for independent coffee shops and cafes'),
    ('Fitness Trainer', 'Captions for personal trainers and fitness professionals'),
    ('Fashion Brand', 'Captions for fashion brands and boutiques'),
    ('Food Blogger', 'Captions for food bloggers and restaurants'),
    ('Real Estate', 'Captions for real estate agents and property listings'),
    ('Beauty Salon', 'Captions for beauty salons and spas'),
    ('Restaurant', 'Captions for restaurants and food businesses'),
    ('Fitness Studio', 'Captions for gyms and fitness studios'),
    ('Retail Shop', 'Captions for retail stores and boutiques'); 