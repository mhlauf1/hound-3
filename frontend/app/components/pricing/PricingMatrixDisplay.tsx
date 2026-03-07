'use client'

import {FadeIn} from '@/app/components/ui/FadeIn'

type PricingMatrixDisplayProps = {
  tables?: Array<{
    _key: string
    tableName?: string
    tableDescription?: string
    columnHeaders?: string[]
    rows?: Array<{
      _key: string
      rowLabel?: string
      cells?: Array<{
        _key: string
        value?: string
        note?: string
      }>
    }>
  }>
  footnotes?: string[]
}

export default function PricingMatrixDisplay({tables, footnotes}: PricingMatrixDisplayProps) {
  if (!tables) return null

  return (
    <>
      {tables.map((table, ti) => (
        <FadeIn key={table._key} delay={0.1 * ti}>
          <div className="mb-12 last:mb-0">
            {table.tableName && (
              <h3 className="text-[24px] md:text-[32px] leading-[120%] text-forest mb-2">
                {table.tableName}
              </h3>
            )}
            {table.tableDescription && (
              <p className="font-sans text-[14px] md:text-[16px] text-charcoal/60 mb-6">
                {table.tableDescription}
              </p>
            )}

            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
              <table className="w-full border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-forest text-cream">
                    <th className="text-left font-sans text-[13px] md:text-[14px] font-medium uppercase tracking-wider px-4 py-3 rounded-tl-lg">
                      &nbsp;
                    </th>
                    {table.columnHeaders?.map((header, hi) => (
                      <th
                        key={hi}
                        className={`text-center font-sans text-[13px] md:text-[14px] font-medium px-4 py-3 ${hi === (table.columnHeaders?.length ?? 0) - 1 ? 'rounded-tr-lg' : ''}`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows?.map((row, ri) => (
                    <tr key={row._key} className={ri % 2 === 0 ? 'bg-sand/30' : 'bg-cream'}>
                      <td className="font-sans text-[14px] md:text-[16px] font-medium text-forest px-4 py-3 sticky left-0 z-10 bg-inherit">
                        {row.rowLabel}
                      </td>
                      {row.cells?.map((cell) => (
                        <td key={cell._key} className="text-center px-4 py-3">
                          {cell.value ? (
                            <div>
                              <span className="font-sans text-[16px] md:text-[18px] font-medium text-terracotta">
                                {cell.value}
                              </span>
                              {cell.note && (
                                <p className="font-sans text-[12px] italic text-charcoal/50 mt-0.5">
                                  {cell.note}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-charcoal/30">&mdash;</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      ))}

      {footnotes && footnotes.length > 0 && (
        <FadeIn delay={0.2}>
          <div className="mt-8 space-y-1">
            {footnotes.map((note, i) => (
              <p key={i} className="font-sans text-[13px] text-charcoal/60 italic">
                {note}
              </p>
            ))}
          </div>
        </FadeIn>
      )}
    </>
  )
}
