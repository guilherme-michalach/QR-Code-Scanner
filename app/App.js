import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

// Fazer essa implementação posteriormente
import Clipboard from '@react-native-clipboard/clipboard';

export default function App() {
  const [hasPerm, setHasPerm] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Não escaneado ainda.')

  const askForCameraPerm = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPerm(status === 'granted');
    })()
  }

  // Pedir permissão de câmera

  useEffect(() => {
    askForCameraPerm();
  }, []);

  // O que acontece ao escanear

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data)
    console.log('Tipo: ' + type + '\nDados: ' + data)
  };

  // Checar permissões e retornar telas com base nelas

  if (hasPerm === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>)
  }
  if (hasPerm === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title={'Permitir câmera'} onPress={() => askForCameraPerm()} />
      </View>)
  }

  // Retorno da View com permissão concedida

  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }} 
        />
      </View>
      <Text style={styles.maintext}>{text}</Text>

      {scanned && <Button title={'Escanear novamente?'} onPress={() => setScanned(false)} color='tomato' />}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 20,
    margin: 20,
    marginTop: 10
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: '#272727'
  }
});
