import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lazryrfxndirnqmwcapt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhenJ5cmZ4bmRpcm5xbXdjYXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMjIyNTMsImV4cCI6MjA5NjY5ODI1M30.x4NTv51R3nleMsNW-7DrZQQBN2KZ5AkypAlVyiJ1OoA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
