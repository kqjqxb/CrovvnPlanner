import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Alert,
  SafeAreaView,
  ImageBackground,
  Modal,
  TextInput,

} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const fontInterRegular = 'Inter18pt-Regular';

const AnalysisScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  return (
    <SafeAreaView style={{
      alignItems: 'center',
      width: dimensions.width,
      position: 'relative',
      flex: 1,
      justifyContent: 'flex-start',
      backgroundColor: '#090909',
    }} >
      <Text style={{
        textAlign: 'center',
        fontFamily: fontInterRegular,
        fontWeight: 700,
        fontSize: dimensions.width * 0.052,
        alignItems: 'center',
        alignSelf: 'center',
        color: 'white',
      }}
      >
        Productivity Analysis
      </Text>

      {/* <View style={{
        width: dimensions.width * 0.93,
        paddingVertical: dimensions.height * 0.019,
        paddingHorizontal: dimensions.width * 0.05,
        backgroundColor: '#1D1D1D',
        alignSelf: 'center',
        borderRadius: dimensions.width * 0.025,
        alignItems: 'center',
        marginTop: dimensions.height * 0.03,

      }}>
        <Image source={require('../assets/images/noAnalitics.png')} style={{
          width: dimensions.width * 0.55,
          height: dimensions.width * 0.55,
          left: dimensions.width * 0.03,
        }}
          resizeMode='contain'
        />


        <Text style={{
          textAlign: 'center',
          fontFamily: fontInterRegular,
          fontWeight: 700,
          fontSize: dimensions.width * 0.055,
          alignItems: 'center',
          alignSelf: 'center',
          color: 'white',
          paddingHorizontal: dimensions.width * 0.05,
          paddingBottom: dimensions.height * 0.01,
        }}
        >
          You don't have analytics yet
        </Text>
      </View> */}

      <Image source={require('../assets/images/noAnalitics.png')} style={{
        width: dimensions.width * 0.46,
        height: dimensions.width * 0.46,
        marginTop: dimensions.height * 0.03,
        left: dimensions.width * 0.014,
      }}
        resizeMode='contain'
      />

      <View style={{
        width: dimensions.width * 0.93,
        paddingVertical: dimensions.height * 0.028,
        paddingHorizontal: dimensions.width * 0.03,
        backgroundColor: '#1D1D1D',
        alignSelf: 'center',
        borderRadius: dimensions.width * 0.025,
        alignItems: 'center',
        marginTop: dimensions.height * 0.03,
        overflow: 'hidden', // Важливо для правильного відображення трикутника
      }}>

        <View style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderLeftWidth: dimensions.width * 0.43,
          borderTopWidth: dimensions.width * 0.37,
          borderLeftColor: 'transparent',
          borderTopColor: '#FFDE59',
        }} />

        <View style={{
          width: dimensions.width * 0.45,
          alignSelf: 'flex-start',
        }}>

          <Text style={{
            textAlign: 'center',
            fontFamily: fontInterRegular,
            fontWeight: '700',
            fontSize: dimensions.width * 0.04,
            alignItems: 'center',
            alignSelf: 'flex-start',
            color: 'white',
            paddingHorizontal: dimensions.width * 0.01,
          }}>
            Projects Completed
          </Text>

          <Text style={{
            textAlign: 'center',
            fontFamily: fontInterRegular,
            fontWeight: '300',
            fontSize: dimensions.width * 0.03,
            alignItems: 'center',
            alignSelf: 'flex-start',
            color: 'white',
            opacity: 0.5,
            paddingHorizontal: dimensions.width * 0.01,
            marginTop: dimensions.height * 0.016,
          }}>
            Total projects completed
          </Text>

          <Text style={{
            textAlign: 'center',
            fontFamily: fontInterRegular,
            fontWeight: '700',
            fontSize: dimensions.width * 0.08,
            alignItems: 'center',
            alignSelf: 'flex-start',
            color: 'white',
            paddingHorizontal: dimensions.width * 0.01,
            marginTop: dimensions.height * 0.019,
          }}>
            15
          </Text>
        </View>
      </View>


      <View style={{
        width: dimensions.width * 0.93,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: dimensions.height * 0.01,
      }}>
        <View style={{
          width: dimensions.width * 0.455,
          paddingVertical: dimensions.height * 0.028,
          paddingHorizontal: dimensions.width * 0.01,
          backgroundColor: '#1D1D1D',
          alignSelf: 'center',
          borderRadius: dimensions.width * 0.025,
          alignItems: 'center',
        }}>
          <Text style={{
            textAlign: 'center',
            fontFamily: fontInterRegular,
            fontWeight: '700',
            fontSize: dimensions.width * 0.04,
            alignItems: 'center',
            alignSelf: 'flex-start',
            color: 'white',
            paddingHorizontal: dimensions.width * 0.01,
          }}>
            Time Usage
          </Text>

          <Text style={{
            textAlign: 'left',
            fontFamily: fontInterRegular,
            fontWeight: '300',
            fontSize: dimensions.width * 0.03,
            alignSelf: 'flex-start',
            color: 'white',
            opacity: 0.5,
            paddingHorizontal: dimensions.width * 0.01,
            marginTop: dimensions.height * 0.016,
          }}
          >
            Total hours worked last week
          </Text>

          <Text style={{
            textAlign: 'center',
            fontFamily: fontInterRegular,
            fontWeight: '700',
            fontSize: dimensions.width * 0.08,
            alignItems: 'center',
            alignSelf: 'flex-start',
            color: 'white',
            paddingHorizontal: dimensions.width * 0.01,
            marginTop: dimensions.height * 0.019,
          }}>
            35 <Text style={{
              textAlign: 'center',
              fontFamily: fontInterRegular,
              fontWeight: '700',
              fontSize: dimensions.width * 0.068,
              alignItems: 'center',
              alignSelf: 'flex-start',
              color: 'white',
              paddingHorizontal: dimensions.width * 0.01,
              marginTop: dimensions.height * 0.019,
            }}>
              hours
            </Text>
          </Text>
        </View>


        <View style={{
          width: dimensions.width * 0.455,
          paddingVertical: dimensions.height * 0.028,
          paddingHorizontal: dimensions.width * 0.01,
          backgroundColor: '#1D1D1D',
          alignSelf: 'center',
          borderRadius: dimensions.width * 0.025,
          alignItems: 'center',
        }}>
          <Text style={{
            textAlign: 'center',
            fontFamily: fontInterRegular,
            fontWeight: '700',
            fontSize: dimensions.width * 0.04,
            alignItems: 'center',
            alignSelf: 'flex-start',
            color: 'white',
            paddingHorizontal: dimensions.width * 0.01,
          }}>
            Project Completion
          </Text>

          <Text style={{
            textAlign: 'left',
            fontFamily: fontInterRegular,
            fontWeight: '300',
            fontSize: dimensions.width * 0.03,
            alignSelf: 'flex-start',
            color: 'white',
            opacity: 0.5,
            paddingHorizontal: dimensions.width * 0.01,
            marginTop: dimensions.height * 0.016,
          }}
          >
            Total projects completed
          </Text>

          <Text style={{
            textAlign: 'center',
            fontFamily: fontInterRegular,
            fontWeight: '700',
            fontSize: dimensions.width * 0.08,
            alignItems: 'center',
            alignSelf: 'flex-start',
            color: 'white',
            paddingHorizontal: dimensions.width * 0.01,
            marginTop: dimensions.height * 0.019,
          }}>
            3
          </Text>
        </View>

      </View>



    </SafeAreaView>
  );
};

export default AnalysisScreen;
