import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { useUsuarioDB } from '../db/useUsuarioDB';

interface Props {
  onGoBackToLogin: () => void;
}

export default function Cadastro({ onGoBackToLogin }: Props) {
  const { adicionar } = useUsuarioDB();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      console.log("Cadastro de Usuario: Dados incompletos");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      console.log("Cadastro de Usuario: Dados incompletos");
      return;
    }

    try {
      await adicionar({
        nome,
        email,
        senha,
        dataCriacao: new Date().toISOString(),
      });
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');

      onGoBackToLogin();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar o usuário');
      console.log("Tala de Cadastro: Erro ao cadastrar usuario: ", error)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.boxImage}>
        <Image
          source={require('../../assets/icon.png')}
          style={{ width: 100, height: 100 }}
          />
      </View>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />
      <View style={styles.containerBotao}>
        <TouchableOpacity style={styles.buttonCadastrar} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonVoltar} onPress={onGoBackToLogin}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: "#FFFFFF" },
  boxImage: { height: "20%", width: "20%" , justifyContent : "center", position: "absolute", top: 130, left: "42%"},
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: "#A0D4F7" },
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
  buttonCadastrar: {
    backgroundColor: '#A0D4F7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonVoltar: {
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
