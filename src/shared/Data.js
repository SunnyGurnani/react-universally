import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"

/**
 *
 *
 */
export function emptyReducer(previousState = {}, action) {
  return previousState
}

/**
 *
 *
 */
export function emptyMiddleware(store) {
  return function(next) {
    return function(action) {
      return next(action)
    }
  }
}

/**
 *
 *
 */
export function emptyEnhancer(param) {
  return param
}


const devTools = process.env.TARGET === "client" &&
  process.env.NODE_ENV === "development" &&
  window.devToolsExtension ?
    window.devToolsExtension() : emptyEnhancer


/**
 *
 *
 */
export function ssrReducer(previousState = {}, action) {
  return previousState
}


/**
 *
 *
 */
export function createReduxStore({ initialState, reducers = {}, middlewares = [], enhancers = [] }) {
  const rootReducer = combineReducers({
    ...reducers,
    ssr: ssrReducer,
  })

  const rootEnhancers = compose(
    applyMiddleware(
      thunk,
      ...middlewares
    ),
    ...enhancers,
    devTools
  )

  const store = createStore(
    rootReducer,
    initialState,
    rootEnhancers
  )

  return store
}
