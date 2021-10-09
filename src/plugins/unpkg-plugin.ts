import axios from 'axios'
import * as esbuild from 'esbuild-wasm/esm/browser'

export const unpkgPlugin: esbuild.Plugin = {
  name: 'unpkg-plugin',
  setup(build: esbuild.PluginBuild) {
    build.onResolve({ filter: /.*/ }, async (args: any) => {
      console.log('onResolve', args)

      if (args.path === 'index.js') {
        return {
          path: args.path,
          namespace: 'a',
        }
      }

      if (args.path.includes('./') || args.path.includes('../')) {
        return {
          path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/')
            .href,
          namespace: 'a',
        }
      }

      return {
        namespace: 'a',
        path: `https://unpkg.com/${args.path}`,
      }
    })

    build.onLoad({ filter: /.*/ }, async (args: any) => {
      if (args.path === 'index.js') {
        return {
          loader: 'jsx',
          contents: `
            const message = require('react')
            console.log(message)
            `,
        }
      }

      const { data, request } = await axios.get(args.path)

      return {
        loader: 'jsx',
        contents: data,
        resolveDir: new URL('./', request.responseURL).pathname,
      }
    })
  },
}
