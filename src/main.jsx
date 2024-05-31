import ReactDOM from 'react-dom/client'
import './index.css'

import { AppProvider, Stage, useApp } from "@pixi/react"
import { useEffect, useState } from "react"
import { Application } from 'pixi.js'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppProvider value={new Application()}>
    <App />
  </AppProvider>
)
