'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { church } from '@/lib/data'

const rows: { label: string; value: string }[] = [
  { label: 'Banco', value: church.bank.name },
  { label: 'Tipo de cuenta', value: church.bank.type },
  { label: 'Número de cuenta', value: church.bank.number },
  { label: 'Llave Bre-B', value: church.bank.breBKey },
  { label: 'Titular', value: church.bank.holder },
  { label: 'NIT', value: church.bank.nit },
]

function CopyButton({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — user can still select the value manually
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full bg-beige-foreground px-6 py-3 text-sm font-medium text-beige transition-opacity hover:opacity-90"
    >
      {copied ? (
        <>
          <Check className="size-4" />
          Copiado
        </>
      ) : (
        <>
          <Copy className="size-4" />
          {label}
        </>
      )}
    </button>
  )
}

export function BankCard() {
  return (
    <Reveal>
      <div className="overflow-hidden rounded-t-[2.5rem] rounded-b-2xl border border-foreground/10 bg-beige text-beige-foreground">
        <div className="p-8 md:p-10">
          <span className="text-[11px] font-medium tracking-[0.28em] uppercase opacity-60">
            Transferencia bancaria
          </span>
          <dl className="mt-8 grid gap-5 sm:grid-cols-2">
            {rows.map((row) => (
              <div key={row.label}>
                <dt className="text-xs text-beige-foreground/60">
                  {row.label}
                </dt>
                <dd className="mt-1 text-lg font-medium tracking-tight">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <CopyButton
              label="Copiar número de cuenta"
              value={church.bank.number}
            />
            <CopyButton
              label="Copiar llave Bre-B"
              value={church.bank.breBKey}
            />
          </div>
        </div>
      </div>
    </Reveal>
  )
}
