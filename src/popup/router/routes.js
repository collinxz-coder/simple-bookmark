import PageIndex from './pages/Index';
import PageLogin from './pages/Login';

export default [
  {
    path: '/',
    components: {
      default: PageIndex,
      login: PageLogin
    }
  },
]
