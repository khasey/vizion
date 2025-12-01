'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Trade } from '@/types/trades'

export async function uploadTrades(trades: Trade[]) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  // Insert trades into database
  const { data, error } = await supabase
    .from('trades')
    .insert(trades)
    .select()

  if (error) {
    console.error('Error uploading trades:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/trades')
  return { data, success: true }
}

export async function getTrades(limit?: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  let query = supabase
    .from('trades')
    .select('*')
    .eq('user_id', user.id)
    .order('trade_date', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching trades:', error)
    return { error: error.message }
  }

  return { data }
}

export async function deleteTrade(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifié' }
  }

  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting trade:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/trades')
  return { success: true }
}
