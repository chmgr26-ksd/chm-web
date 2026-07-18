'use client';

import { useState, useEffect } from 'react';
import { Field, Input, Select, Switch, Button, Alert } from '@chm/design-system';
import {
  NOTICE_HERO_DEFAULTS,
  NOTICE_HERO_RANGES,
  NOTICE_GRADIENT_PRESETS,
  slideGradient,
} from '@/lib/noticeHero';

const GRADIENT_OPTIONS = Object.entries(NOTICE_GRADIENT_PRESETS).map(([value, p]) => ({ value, label: p.label }));

// 선택한 톤의 5색 스와치 미리보기 — 'brand'는 카테고리 브랜드색(CSS 변수).
const BRAND_VALUES = ['trust', 'cooperation', 'community', 'selfreliance', 'innovation'];
function GradientPreview({ gradient }) {
  const preset = NOTICE_GRADIENT_PRESETS[gradient] || NOTICE_GRADIENT_PRESETS.amber;
  const count = preset.colors ? preset.colors.length : BRAND_VALUES.length;
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="h-9 flex-1 rounded-chm-md"
          style={{ background: slideGradient(gradient, BRAND_VALUES[i % BRAND_VALUES.length], i) }}
        />
      ))}
    </div>
  );
}

export default function NoticeHeroForm() {
  const [form, setForm] = useState(NOTICE_HERO_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetch('/api/settings/notice-hero')
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) {
          setForm({
            heroInterval: d.heroInterval,
            rollInterval: d.rollInterval,
            excerptLen: d.excerptLen,
            gradient: d.gradient,
            autoplay: d.autoplay,
            showRoller: d.showRoller,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const setNum = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value === '' ? '' : Number(e.target.value) }));
  const setVal = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setChk = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.checked }));

  const save = async (e) => {
    e.preventDefault();
    setMsg(null);
    setSaving(true);
    try {
      const res = await fetch('/api/settings/notice-hero', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg({ tone: 'danger', text: d.error || '저장에 실패했습니다.' }); return; }
      setMsg({ tone: 'success', text: '저장되었습니다. 랜딩 최상단 공지 배너에 곧 반영됩니다.' });
    } catch {
      setMsg({ tone: 'danger', text: '네트워크 오류로 저장하지 못했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-body-sm text-ink-500">불러오는 중…</div>;

  const R = NOTICE_HERO_RANGES;
  return (
    <form onSubmit={save} className="flex max-w-2xl flex-col gap-5">
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      <Alert tone="info">범위를 벗어난 값은 저장 시 자동으로 보정됩니다. 공지 글이 없으면 기관 소개 배너로 표시됩니다.</Alert>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="배너 전환 간격" hint={`${R.heroInterval.min}~${R.heroInterval.max}초`}>
          <Input type="number" min={R.heroInterval.min} max={R.heroInterval.max} value={form.heroInterval} onChange={setNum('heroInterval')} />
        </Field>
        <Field label="롤러 이동 간격" hint={`${R.rollInterval.min}~${R.rollInterval.max}초`}>
          <Input type="number" min={R.rollInterval.min} max={R.rollInterval.max} value={form.rollInterval} onChange={setNum('rollInterval')} />
        </Field>
        <Field label="설명 발췌 길이" hint={`${R.excerptLen.min}~${R.excerptLen.max}자`}>
          <Input type="number" min={R.excerptLen.min} max={R.excerptLen.max} value={form.excerptLen} onChange={setNum('excerptLen')} />
        </Field>
      </div>

      <Field label="배너 그라디언트 톤" hint="배너 5장에 순환 적용됩니다">
        <Select value={form.gradient} onChange={setVal('gradient')} options={GRADIENT_OPTIONS} />
      </Field>
      <GradientPreview gradient={form.gradient} />

      <div className="flex items-center justify-between rounded-chm-lg border border-border p-4">
        <div>
          <div className="text-body font-semibold text-ink-800">자동 전환 · 롤링</div>
          <div className="text-caption text-ink-500">끄면 배너·공지 롤러가 자동으로 움직이지 않고 수동 조작만 됩니다.</div>
        </div>
        <Switch checked={form.autoplay} onChange={setChk('autoplay')} />
      </div>

      <div className="flex items-center justify-between rounded-chm-lg border border-border p-4">
        <div>
          <div className="text-body font-semibold text-ink-800">공지 롤러 표시</div>
          <div className="text-caption text-ink-500">끄면 우측 공지 롤러를 숨기고 배너가 가로 전체를 차지합니다.</div>
        </div>
        <Switch checked={form.showRoller} onChange={setChk('showRoller')} />
      </div>

      <div className="border-t border-border pt-5">
        <Button type="submit" tone="primary" loading={saving}>저장</Button>
      </div>
    </form>
  );
}
