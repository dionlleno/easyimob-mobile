import { StyleSheet } from "react-native";
import CompromissosStackRoutes from "../routes/compromissos.stack.routes";

export default function Clientes() {
  return <CompromissosStackRoutes />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
