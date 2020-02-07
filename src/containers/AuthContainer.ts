import { connect } from 'react-redux'
import { Dispatch, Action } from 'redux'
import { ReduxState } from '../store'
import firebase from '../firebase'
import { Auth, UserInfo, authActions } from '../modules/Auth'

export interface AuthActions {
  login: () => Action<string>
  refLogin: () => Action<string>
  logout: () => Action<string>
}

export function setUserInfo(fuser: firebase.User | null): UserInfo {
  if (!fuser) {
    return {}
  }
  return {
    displayName: fuser.displayName,
    email: fuser.email,
    uuid: fuser.uid
  }
}

function mapDispatchToProps(dispatch: Dispatch<Action<string>>) {
  return {
    login: () => {
      firebase.auth().createUserWithEmailAndPassword('test@qmail.com', 'password')
      firebase.auth().onAuthStateChanged(user => {
        if (user!) {
          return
        }

        dispatch(authActions.login(setUserInfo(user)))
      })
    },
    refLogin: () => {
      firebase.auth().onAuthStateChanged(user => {
        if (!user) {
          return
        }

        dispatch(authActions.login(setUserInfo(user)))
      })
    },
    logout: () => {
      firebase.auth().signOut()
      dispatch(authActions.logout())
    }
  }
}

function mapStateToProps(state: ReduxState) {
  return Object.assign({}, { userInfo: state.userInfo })
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Auth)
