/*
  # Projects and Discovery Data Schema

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `idea` (text, the original user idea)
      - `created_at` (timestamp)
    
    - `project_questions_data`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `question_text` (text, the question)
      - `options` (jsonb, array of options)
      - `selected_answer` (text, user's selected answer)
      - `created_at` (timestamp)
    
    - `suggestions`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `name` (text, suggestion type like "startup_name")
      - `value` (text, the suggestion value)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their own projects and data
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  idea text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create project questions data table
CREATE TABLE IF NOT EXISTS project_questions_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL,
  selected_answer text,
  created_at timestamptz DEFAULT now()
);

-- Create suggestions table
CREATE TABLE IF NOT EXISTS suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_questions_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can read own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Project questions data policies
CREATE POLICY "Users can read own project questions"
  ON project_questions_data
  FOR SELECT
  TO authenticated
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own project questions"
  ON project_questions_data
  FOR INSERT
  TO authenticated
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own project questions"
  ON project_questions_data
  FOR UPDATE
  TO authenticated
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()))
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own project questions"
  ON project_questions_data
  FOR DELETE
  TO authenticated
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- Suggestions policies
CREATE POLICY "Users can read own suggestions"
  ON suggestions
  FOR SELECT
  TO authenticated
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own suggestions"
  ON suggestions
  FOR INSERT
  TO authenticated
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own suggestions"
  ON suggestions
  FOR UPDATE
  TO authenticated
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()))
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own suggestions"
  ON suggestions
  FOR DELETE
  TO authenticated
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));