
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDAzMjI5NCwiZXhwIjoxOTQ5NjA4Mjk0fQ.5AJhHMk5HgNvqiBm9w_vCBezpCt8b3JDi-z3seAnhrc'
  import {createClient} from '@supabase/supabase-js'
  const supabaseUrl = 'https://vbfzhdccxczwbluqmhtv.supabase.co'
  const supabaseKey = process.env.SUPABASE_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)
