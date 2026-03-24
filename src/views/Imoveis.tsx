import { StyleSheet } from 'react-native';
import ImoveisStackRoutes from '../routes/imoveis.stack.routes';

export default function Imoveis() {
    return (
        <ImoveisStackRoutes/>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title:{
        fontSize: 22,
        fontWeight: "bold"
    }
});