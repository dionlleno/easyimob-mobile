import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDB } from "../db/initializeDB";
import TabRoutes from "./tab.routes";
import Login from "../views/Login";
import Cadastro from "../views/Cadastro";

export default function Routes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCadastro, setIsCadastro] = useState(false); // controle da tela de cadastro

  return (
    <SQLiteProvider databaseName="myDatabase.db" onInit={initializeDB}>
      <NavigationContainer>
        {isLoggedIn ? (
          <TabRoutes />
        ) : isCadastro ? (
          <Cadastro onGoBackToLogin={() => setIsCadastro(false)} />
        ) : (
          <Login
            onLoginSuccess={() => setIsLoggedIn(true)}
            onGoToCadastro={() => setIsCadastro(true)} // adiciona callback
          />
        )}
      </NavigationContainer>
    </SQLiteProvider>
  );
}
