import { User } from './../../interfaces/user';
import { userInitialState } from './../../interfaces/user-initial-state';
import * as userActions from './../../actions/user/user.actions';

export function reducer(
  state = userInitialState,
  action: userActions.UserActions
): User {
  switch (action.type) {
    case userActions.SET_USER: {
      return Object.assign({}, state, action.payload);
    }
    case userActions.GET_USER: {
      return Object.assign({}, state, action.payload);
    }
    default: {
      return state;
    }
  }
}
