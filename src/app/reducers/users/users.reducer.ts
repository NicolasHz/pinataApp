import { User } from './../../interfaces/user';
import { userInitialState } from './../../interfaces/user-initial-state';
import * as usersActions from './../../actions/users/users.actions';

export function reducer(
  state = [userInitialState],
  action: usersActions.UsersActions
): User[] {
  switch (action.type) {
    case usersActions.SET_USERS: {
      return Object.assign({}, state, action.payload);
    }
    case usersActions.GET_USERS: {
      return Object.assign({}, state, action.payload);
    }
    default: {
      return state;
    }
  }
}
