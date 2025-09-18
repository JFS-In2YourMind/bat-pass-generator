import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet, Switch } from 'react-native';
import * as Clipboard from 'expo-clipboard';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUM = '0123456789';
const SYM = '!@#$%^&*()-_=+[]{};:,.<>/?';

function generatePassword(len: number, opts: {upper: boolean; lower: boolean; num: boolean; sym: boolean}) {
  let dict = '';
  if (opts.upper) dict += UPPER;
  if (opts.lower) dict += LOWER;
  if (opts.num) dict += NUM;
  if (opts.sym) dict += SYM;
  if (!dict) dict = LOWER; // fallback
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += dict.charAt(Math.floor(Math.random() * dict.length));
  }
  return pwd;
}

export default function App() {
  const [len, setLen] = useState(12);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [num, setNum] = useState(true);
  const [sym, setSym] = useState(false);
  const [pwd, setPwd] = useState('');

  const strength = useMemo(() => {
    let s = 0;
    if (upper) s++;
    if (lower) s++;
    if (num) s++;
    if (sym) s++;
    s += len >= 12 ? 1 : 0;
    return Math.min(s, 5);
  }, [upper, lower, num, sym, len]);

  const onGenerate = () => setPwd(generatePassword(len, { upper, lower, num, sym }));
  const onCopy = async () => {
    if (pwd) await Clipboard.setStringAsync(pwd);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>BAT PASS GENERATOR</Text>
        <Text style={styles.subtitle}>Sequenciador de senhas do Batman 🦇</Text>

        <View style={styles.card}>
          <Row label={`Tamanho: ${len}`}>
            <View style={styles.stepper}>
              <Pressable style={styles.btnMini} onPress={() => setLen(Math.max(6, len-1))}><Text style={styles.btnMiniText}>-</Text></Pressable>
              <Pressable style={styles.btnMini} onPress={() => setLen(Math.min(32, len+1))}><Text style={styles.btnMiniText}>+</Text></Pressable>
            </View>
          </Row>

          <Row label="Maiúsculas">
            <Switch value={upper} onValueChange={setUpper} thumbColor="#FFD913" trackColor={{ true: '#1F2937', false: '#111827' }} />
          </Row>
          <Row label="Minúsculas">
            <Switch value={lower} onValueChange={setLower} thumbColor="#FFD913" trackColor={{ true: '#1F2937', false: '#111827' }} />
          </Row>
          <Row label="Números">
            <Switch value={num} onValueChange={setNum} thumbColor="#FFD913" trackColor={{ true: '#1F2937', false: '#111827' }} />
          </Row>
          <Row label="Símbolos">
            <Switch value={sym} onValueChange={setSym} thumbColor="#FFD913" trackColor={{ true: '#1F2937', false: '#111827' }} />
          </Row>

          <View style={styles.strength}>
            {Array.from({ length: 5 }).map((_, i) => (
              <View key={i} style={[styles.stripe, i < strength ? styles.stripeOn : styles.stripeOff]} />
            ))}
            <Text style={styles.strengthText}>força</Text>
          </View>

          <Pressable style={styles.btnPrimary} onPress={onGenerate}>
            <Text style={styles.btnPrimaryText}>Gerar senha</Text>
          </Pressable>

          <View style={styles.output}>
            <Text style={styles.outputText} selectable>{pwd || '••••••••••••'}</Text>
            <Pressable style={styles.btnCopy} onPress={onCopy}><Text style={styles.btnCopyText}>Copiar</Text></Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, children }: {label: string; children: React.ReactNode}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0B0F1A' },
  container: { flex: 1, padding: 20, gap: 16 },
  title: { color: '#FFD913', fontSize: 22, fontWeight: '800', letterSpacing: 2, textAlign: 'center' },
  subtitle: { color: '#9CA3AF', fontSize: 14, textAlign: 'center', marginBottom: 8 },
  card: { backgroundColor: '#111827', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1F2937', gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
  rowLabel: { color: '#E5E7EB', fontSize: 16 },
  stepper: { flexDirection: 'row', gap: 8 },
  btnMini: { backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1F2937', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  btnMiniText: { color: '#E5E7EB', fontSize: 16, fontWeight: '700' },
  strength: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 6 },
  stripe: { height: 6, width: 30, borderRadius: 3, backgroundColor: '#1F2937' },
  stripeOn: { backgroundColor: '#FFD913' },
  stripeOff: { backgroundColor: '#1F2937' },
  strengthText: { color: '#9CA3AF', marginLeft: 8, fontSize: 12 },
  btnPrimary: { backgroundColor: '#FFD913', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnPrimaryText: { color: '#0B0F1A', fontWeight: '800', letterSpacing: 1 },
  output: { marginTop: 8, padding: 12, borderRadius: 10, backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1F2937', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  outputText: { color: '#E5E7EB', fontSize: 16, fontFamily: 'monospace' },
  btnCopy: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#111827', borderRadius: 8, borderWidth: 1, borderColor: '#1F2937' },
  btnCopyText: { color: '#FFD913', fontWeight: '700' },
});
