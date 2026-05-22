import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Text, Canto, Verse, Annotation, WordGloss, ScriptType } from '../lib/types';

export function useTexts() {
  const [texts, setTexts] = useState<Text[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('texts')
        .select('*')
        .order('title_latin');
      if (!error && data) setTexts(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return { texts, loading };
}

export function useCantos(textId: string | null) {
  const [cantos, setCantos] = useState<Canto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!textId) { setCantos([]); setLoading(false); return; }
    const fetch = async () => {
      const { data, error } = await supabase
        .from('cantos')
        .select('*')
        .eq('text_id', textId)
        .order('canto_number');
      if (!error && data) setCantos(data);
      setLoading(false);
    };
    fetch();
  }, [textId]);

  return { cantos, loading };
}

export function useVerses(cantoId: string | null) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cantoId) { setVerses([]); setLoading(false); return; }
    const fetch = async () => {
      const { data, error } = await supabase
        .from('verses')
        .select('*')
        .eq('canto_id', cantoId)
        .order('verse_number');
      if (!error && data) setVerses(data);
      setLoading(false);
    };
    fetch();
  }, [cantoId]);

  return { verses, loading };
}

export function useAnnotations(verseId: string | null) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!verseId) { setAnnotations([]); setLoading(false); return; }
    const fetch = async () => {
      const { data, error } = await supabase
        .from('annotations')
        .select('*')
        .eq('verse_id', verseId);
      if (!error && data) setAnnotations(data);
      setLoading(false);
    };
    fetch();
  }, [verseId]);

  return { annotations, loading };
}

export function useWordGlosses(verseId: string | null) {
  const [glosses, setGlosses] = useState<WordGloss[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!verseId) { setGlosses([]); setLoading(false); return; }
    const fetch = async () => {
      const { data, error } = await supabase
        .from('word_glosses')
        .select('*')
        .eq('verse_id', verseId)
        .order('word_index');
      if (!error && data) setGlosses(data);
      setLoading(false);
    };
    fetch();
  }, [verseId]);

  return { glosses, loading };
}

export function useAllAnnotations(textId: string | null) {
  const [annotations, setAnnotations] = useState<(Annotation & { verse_id: string; verse_text?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!textId) { setAnnotations([]); setLoading(false); return; }
    const fetch = async () => {
      const { data: cantosData } = await supabase
        .from('cantos')
        .select('id')
        .eq('text_id', textId);
      if (!cantosData || cantosData.length === 0) { setLoading(false); return; }

      const cantoIds = cantosData.map(c => c.id);
      const { data: versesData } = await supabase
        .from('verses')
        .select('id, text_devanagari')
        .in('canto_id', cantoIds);
      if (!versesData || versesData.length === 0) { setLoading(false); return; }

      const verseIds = versesData.map(v => v.id);
      const verseMap = new Map(versesData.map(v => [v.id, v.text_devanagari]));

      const { data: annData } = await supabase
        .from('annotations')
        .select('*')
        .in('verse_id', verseIds);
      if (annData) {
        setAnnotations(annData.map(a => ({ ...a, verse_text: verseMap.get(a.verse_id) ?? '' })));
      }
      setLoading(false);
    };
    fetch();
  }, [textId]);

  return { annotations, loading };
}

export function useScript() {
  const [script, setScript] = useState<ScriptType>(() => {
    return (localStorage.getItem('sanskrit-script') as ScriptType) || 'devanagari';
  });

  const changeScript = useCallback((s: ScriptType) => {
    setScript(s);
    localStorage.setItem('sanskrit-script', s);
  }, []);

  return { script, changeScript };
}
