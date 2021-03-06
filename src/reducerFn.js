"use strict";

/* eslint no-case-declarations: 0 */
import { setExpire } from "./utils/cache";

/**
 * Reducer contructor
 * @param  {Object}   initialState default initial state
 * @param  {Object}   actions      actions map
 * @param  {Function} transformer  transformer function
 * @param  {Function} reducer      custom reducer function
 * @return {Function}              reducer function
 */
export default function reducerFn(initialState, actions={}, reducer) {
  const { actionFetch, actionSuccess, actionFail, actionReset, actionCache } = actions;
  return (state=initialState, action)=> {
    switch (action.type) {
      case actionFetch:
        return {
          ...state,
          loading: true,
          error: null,
          syncing: !!action.syncing
        };
      case actionSuccess:
        return {
          ...state,
          loading: false,
          sync: true,
          syncing: false,
          error: null,
          data: action.data
        };
      case actionFail:
        return {
          ...state,
          loading: false,
          error: action.error,
          syncing: false
        };
      case actionReset:
        const { mutation } = action;
        return (mutation === "sync") ?
          { ...state, sync: false } :
          { ...initialState };
      case actionCache:
        const { id, data } = action;
        const expire = setExpire(action.expire, state.cache.expire);
        return {
          ...state,
          cache: { ...state.cache, [id]: { expire, data } }
        };
      default:
        return reducer ? reducer(state, action) : state;
    }
  };
}
