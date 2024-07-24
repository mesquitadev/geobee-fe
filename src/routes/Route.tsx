import {
  Redirect,
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
} from 'react-router-dom'
import Layout from '../components/Layout'

import { useAuth } from '../hooks/useAuth'
import React, { ComponentType } from 'react'

interface IRouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean
  component: ComponentType
}

const Route: React.FC<IRouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { token } = useAuth()
  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        if (token && isPrivate) {
          return (
            <Layout>
              <Component />
            </Layout>
          )
        }

        return isPrivate === !!token ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/home',
              state: { from: location },
            }}
          />
        )
      }}
    />
  )
}
export default Route
