import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';
import { useUsuarioDB } from '../db/useUsuarioDB';

interface Props {
  onLoginSuccess: () => void;
  onGoToCadastro: () => void;
}

export default function Login({ onLoginSuccess, onGoToCadastro }: Props) {

  const { buscarPorEmailSenha } = useUsuarioDB();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Informe o e-mail e a senha');
      return;
    }

    try {
      const usuario = await buscarPorEmailSenha(email, senha);
      if (usuario) {
        Alert.alert("Login", "Bem vindo, " + usuario.nome);
        onLoginSuccess();
      } else {
        Alert.alert('Erro', 'E-mail ou senha inválidos');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível realizar o login');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.boxImage}>
        <Image
          source={require('../../src/assets/img/logo.png')}
          style={{ width: 113, height: 125 }}
          />
      </View>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <View style={styles.containerBotao}>
        <TouchableOpacity style={styles.buttonEntrar} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonCadastrar} onPress={onGoToCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: "#FFFFFF"},
  boxImage: { height: "20%", width: "20%" , justifyContent : "center", position: "absolute", top: 130, left: "42%"},
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: "#A0D4F7"},
  input: {
    borderWidth: 1,
    borderColor: '#A0D4F7',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  cadastroButton: {
    marginTop: 10,
  },
  containerBotao: {
    gap: 10,
  },
  buttonEntrar: {
    backgroundColor: '#A0D4F7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonCadastrar: {
    backgroundColor: '#DDDDDD',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
