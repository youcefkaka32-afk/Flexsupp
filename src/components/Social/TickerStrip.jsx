import React from 'react'
import './TickerStrip.css'

const ITEMS = [
  { text: 'STAY STRONG.',    accent: true  },
  { text: 'STAY INSPIRED.',  accent: false },
  { text: 'STAY STRONG.',    accent: true  },
  { text: 'STAY INSPIRED.',  accent: false },
  { text: 'STAY STRONG.',    accent: true  },
  { text: 'STAY INSPIRED.',  accent: false },
  { text: 'STAY STRONG.',    accent: true  },
  { text: 'STAY INSPIRED.',  accent: false },
  { text: 'STAY STRONG.',    accent: true  },
  { text: 'STAY INSPIRED.',  accent: false },
  { text: 'STAY STRONG.',    accent: true  },
  { text: 'STAY INSPIRED.',  accent: false },
]

function TickerItems() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <span key={i} className={`ticker-strip__item font-display${item.accent ? ' ticker-strip__item--accent' : ''}`}>
          {item.text}
          <span className="ticker-strip__dot" aria-hidden="true" />
        </span>
      ))}
    </>
  )
}

export default function TickerStrip() {
  return (
    <div className="ticker-strip" aria-hidden="true">
      <div className="ticker-strip__track">
        <TickerItems />
        <TickerItems />
      </div>
    </div>
  )
}
