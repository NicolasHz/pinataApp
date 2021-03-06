import { User } from './../../interfaces/user';
import { userInitialState } from './../../interfaces/user-initial-state';
import * as userActions from './../../actions/user/user.actions';

export function reducer(
  state = userInitialState,
  action: userActions.UserActions
): User {
  switch (action.type) {
    case userActions.GET_USER_SUCCESS: {
      return Object.assign({}, state, action.payload);
    }
    // case userActions.GET_USER_FAIL: {
    //   return Object.assign({}, state, action.payload);
    // }
    case userActions.ADD_USER_SUCCESS: {
      return Object.assign({}, state, action.payload);
    }
    // case userActions.ADD_USER_FAIL: {
    //   return Object.assign({}, state, action.payload);
    // }
    case userActions.UPDATE_USER_SUCCESS: {
      return Object.assign({}, state, action.payload);
    }
    case userActions.ADD_USER_TO_ACL_SUCCESS: {
      return Object.assign({}, state, {onCalendarAcl: action.payload});
    }
    case userActions.ADD_USER_TO_ACL_FAIL: {
      return Object.assign({}, state, {onCalendarAcl: action.payload});
    }
    default: {
      return state;
    }
  }
}
