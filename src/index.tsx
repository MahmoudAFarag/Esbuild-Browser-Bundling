import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import * as esbuild from 'esbuild-wasm/esm/browser'
// import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import { unpkgPlugin } from './plugins/unpkg-plugin'

const App = () => {
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')

  useEffect(() => {
    const startService = async () => {
      await esbuild.initialize({
        worker: true,
        wasmURL: '/esbuild.wasm',
      })
    }

    startService()
  }, [])

  const onClick = async () => {
    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPlugin],
    })

    setCode(result.outputFiles[0].text)
  }

  return (
    <div>
      <textarea
        onChange={(e) => setInput(e.target.value)}
        value={input}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  )
}

ReactDOM.render(<App />, document.querySelector('#root'))
