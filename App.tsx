import 'react-native-get-random-values'; // deve ser o primeiro import
import bcrypt from 'bcryptjs';            // importe bcryptjs depois disso
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Routes from './src/routes';

// Configurar o fallback para random bytes
bcrypt.setRandomFallback((len) => {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr);
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Routes/>
    </GestureHandlerRootView>
  );
}
