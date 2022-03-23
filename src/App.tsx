import { FC, useCallback, useRef, useState } from 'react'
import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas'
import './styles.css'

type Style = {
  textColor: string
  backgroundColor: string
  fontSize: number
}

const StyleControls: FC<{
  style: Style
  requestCapture(): void
  onChange(style: Partial<Style>): void
}> = ({ onChange, style, requestCapture }) => {
  return (
    <div style={{ backgroundColor: 'white' }}>
      <label>
        <span>Text color</span>
        <input
          type="color"
          onChange={(e) => onChange({ textColor: e.target.value })}
        />
      </label>
      <label>
        <span>Background color</span>
        <input
          type="color"
          value={style.backgroundColor}
          onChange={(e) => onChange({ backgroundColor: e.target.value })}
        />
      </label>
      <label>
        <span>Font size</span>
        <input
          type="number"
          value={style.fontSize}
          onChange={(e) =>
            onChange({ fontSize: Number.parseInt(e.target.value, 10) })
          }
        />
      </label>
      <button onClick={requestCapture}>Capture...!</button>
    </div>
  )
}

export default function App() {
  const [style, setStyle] = useState<Style>({
    textColor: '#ffffff',
    backgroundColor: '#000000',
    fontSize: 16,
  })
  const [isCapturing, setIsCapturing] = useState(false)
  const appRef = useRef<HTMLDivElement>(null)
  const [text, setText] = useState('Hello...!')

  const handleCapturing = useCallback(async () => {
    setIsCapturing(true)

    await new Promise((resolve) => {
      setTimeout(async () => {
        if (!appRef.current) return

        const canvas = await html2canvas(appRef.current)
        const dataUrl = canvas.toDataURL('image/jpg')

        saveAs(dataUrl, 'image.png')

        resolve(0)
      }, 0)
    })

    setIsCapturing(false)
  }, [])

  return (
    <div
      ref={appRef}
      className="App"
      style={{
        backgroundColor: style.backgroundColor,
      }}
    >
      {isCapturing || (
        <div>
          <StyleControls
            requestCapture={handleCapturing}
            style={style}
            onChange={(style) => {
              setStyle((prev) => ({ ...prev, ...style }))
            }}
          />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      )}
      <h1
        style={{
          color: style.textColor,
          fontSize: style.fontSize,
        }}
      >
        {text}
      </h1>
    </div>
  )
}
