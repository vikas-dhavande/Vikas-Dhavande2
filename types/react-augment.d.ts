import 'react'

declare module 'react' {
  // Polyfill for Appwrite quickstart template referencing SubmitEvent on React
  export type SubmitEvent<T = Element> = React.FormEvent<T>
}
