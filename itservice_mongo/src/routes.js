import App from './pages/App'
import Home from './pages/Home'
import Work from './pages/Work'
import WorkRepair from './pages/WorkRepair'
import User from './pages/User'
import Location from './pages/Location'


const routes = [{
    path: '/',
    component: App,
    indexRoute: { component: Home },
    childRoutes: [
        { path: 'work', component: Work },
        { path: 'workrepair', component: WorkRepair },
        { path: 'user', component: User},
        { path: 'location', component: Location},
    ]
}]
export default routes