import { Switch } from 'react-router-dom'
import {
  Home,
  SignIn,
  SignUp,
  MyApiaries,
  NewApiary,
  MyMeliponaries,
  NewMeliponary,
} from '../pages'
import Route from './Route'

function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={SignIn} />
      <Route exact path="/cadastre-se" component={SignUp} />
      <Route isPrivate path="/home" component={Home} />
      <Route isPrivate path="/meus-apiarios/novo" component={NewApiary} />
      <Route isPrivate path="/meus-apiarios" component={MyApiaries} />
      <Route
        isPrivate
        path="/meus-meliponarios/novo"
        component={NewMeliponary}
      />
      <Route isPrivate path="/meus-meliponarios" component={MyMeliponaries} />
    </Switch>
  )
}

export default Routes
