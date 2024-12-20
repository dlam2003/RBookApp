import { UserProvider } from './src/Context/UserContext';
import AppNavigation from './src/navigation/AppNavigation';

export default function App() {
  return (
    <UserProvider>
      <AppNavigation/>
    </UserProvider>
    
  );
}