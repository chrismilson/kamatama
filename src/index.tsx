import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import App from './ui/App'
import reportWebVitals from './reportWebVitals'
import { register } from './serviceWorkerRegistration'
import './index.scss'

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
