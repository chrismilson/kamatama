import { FC, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Landing from './components/Landing'
import Home from './components/Home'

const App: FC = () => {
  useEffect(() => {}, [])

  return (
    <Router basename="/kamatama">
      <Switch>
        <Route path="/install">
          <Landing />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
