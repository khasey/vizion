-- Activer RLS sur la table trades
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture de ses propres trades
DROP POLICY IF EXISTS "Users can read own trades" ON public.trades;
CREATE POLICY "Users can read own trades"
ON public.trades
FOR SELECT
USING (auth.uid() = user_id);

-- Politique pour permettre l'insertion de ses propres trades
DROP POLICY IF EXISTS "Users can insert own trades" ON public.trades;
CREATE POLICY "Users can insert own trades"
ON public.trades
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre la mise à jour de ses propres trades
DROP POLICY IF EXISTS "Users can update own trades" ON public.trades;
CREATE POLICY "Users can update own trades"
ON public.trades
FOR UPDATE
USING (auth.uid() = user_id);

-- Politique pour permettre la suppression de ses propres trades
DROP POLICY IF EXISTS "Users can delete own trades" ON public.trades;
CREATE POLICY "Users can delete own trades"
ON public.trades
FOR DELETE
USING (auth.uid() = user_id);

-- Si vous avez une table strategies, ajoutez aussi les politiques RLS
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own strategies" ON public.strategies;
CREATE POLICY "Users can read own strategies"
ON public.strategies
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own strategies" ON public.strategies;
CREATE POLICY "Users can insert own strategies"
ON public.strategies
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own strategies" ON public.strategies;
CREATE POLICY "Users can update own strategies"
ON public.strategies
FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own strategies" ON public.strategies;
CREATE POLICY "Users can delete own strategies"
ON public.strategies
FOR DELETE
USING (auth.uid() = user_id);
