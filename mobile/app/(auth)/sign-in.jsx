import { View, Text, Alert, KeyboardAvoidingView, ScrollView, TextInput, Platform, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import {useSignIn} from '@clerk/clerk-expo';
import {authStyles} from '../../assets/styles/auth.styles';
import { COLORS } from '../../constants/colors';

const SignInScreen = () => {
  const router = useRouter();

const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);;
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error','Please enter both email and password');
      return;
    }
    if (!isLoaded) return;
    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
            }      else {
        Alert.alert('Error', 'Sign-in failed. Please check your credentials and try again.');
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      Alert.alert("Error", err.message?.[0]?.message || 'sign in failed)');
      console.error(JSON.stringify(err, null, 2));
      
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={authStyles.keyboardView}
      >

        <ScrollView
        contentContainerStyle={authStyles.scrollContent}
        showVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require('../../assets/images/i1.png')}
              style={authStyles.image}
              contentFit='contain'  
            />  
          </View>
          <Text style={authStyles.title}>Welcome Back</Text>

          {/* FORM CONTAINER */}
          <View style={authStyles.formContainer}>

            {/* EMAIL INPUT */}
            <View style={authStyles.inputContainer}>
              <TextInput
              style={authStyles.textInput}
              placeholder='Enter Email'
              placeholderTextColor={COLORS.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
              />
            </View>
          </View>

            
        </ScrollView>
      </KeyboardAvoidingView>
      
    </View>
  )
}

export default SignInScreen