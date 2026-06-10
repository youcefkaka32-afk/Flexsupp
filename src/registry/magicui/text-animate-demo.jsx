import React from 'react'
import TextAnimate from './text-animate'

export default function TextAnimateDemo() {
  return (
    <div style={{ padding: 24 }}>
      <TextAnimate animation="blurInUp" by="character" once>
        Blur in by character
      </TextAnimate>
    </div>
  )
}
import React from 'react'
import TextAnimate from './text-animate'

export function TextAnimateDemo() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 28, marginBottom: 12 }}>
        <TextAnimate animation="blurInUp" by="character" once>
          Blur in by character
        </TextAnimate>
      </h2>

      <p>
        <TextAnimate animation="fadeInUp" by="word" once>
          This paragraph demonstrates word-based staggering for lively entrances across the site.
        </TextAnimate>
      </p>
    </div>
  )
}

export default TextAnimateDemo
