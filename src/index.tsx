import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './ui/App'
import reportWebVitals from './reportWebVitals'
import { register } from './serviceWorkerRegistration'

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)

register()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
