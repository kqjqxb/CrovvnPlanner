import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';


const fontSFProBold = 'SFProText-Bold';
const fontSfProTextRegular = 'SFProText-Regular';

const formatDateHere = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateBottom = (dateString) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const date = new Date(dateString).toLocaleDateString('en-US', options);
  return date.replace(/(\d{1,2}) (\w+), (\d{4})/, '($1) $2, $3');
};

const formatDateHeader = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

const formatDateToSmth = (dateString) => {
  const [day, month, year] = dateString.split('.');
  return `${year}-${month}-${day}`;
};

const CalendarScreen = ({ }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(formatDateHere(new Date()));
  const [picnics, setPicnics] = useState([]);
  const [today, setToday] = useState(formatDateHere(new Date()));

  useEffect(() => {
    const loadPicnics = async () => {
      try {
        const storedPicnics = await AsyncStorage.getItem('picnics');
        if (storedPicnics) {
          const parsedPicnics = JSON.parse(storedPicnics);
          const formattedPicnics = parsedPicnics.map((thisPicnic) => ({
            ...thisPicnic,
            date: formatDateToSmth(thisPicnic.date),
          }));
          setPicnics(formattedPicnics);
        }
      } catch (error) {
        console.error('Error loading picnics:', error);
      }
    };

    loadPicnics();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTodayHere = formatDateHere(new Date());
      if (currentTodayHere !== today) {
        setToday(currentTodayHere);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [today]);

  const picnicDates = useMemo(() => {
    return picnics
      .filter((thisPicnic) => thisPicnic.date)
      .map((thisPicnic) => thisPicnic.date);
  }, [picnics]);

  const uniquePicnicDates = useMemo(() => {
    return [...new Set(picnicDates)];
  }, [picnicDates]);

  const markedDates = useMemo(() => {
    const marks = {
      [today]: {
        selected: selectedCalendarDate === today,
        selectedColor: '#0875E6',
        textColor: 'white',
      },
    };

    uniquePicnicDates.forEach((date) => {
      if (date === today) return;
      marks[date] = {
        marked: true,
        dotColor: '#0875E6',
        textColor: 'white',
      };
    });

    if (selectedCalendarDate && selectedCalendarDate !== today) {
      marks[selectedCalendarDate] = {
        ...(marks[selectedCalendarDate] || {}),
        selected: true,
        selectedColor: '#0875E6',
        textColor: 'white',
        borderRadius: 0,
      };
    }

    return marks;
  }, [uniquePicnicDates, today, selectedCalendarDate]);

  const handleDayPress = (day) => {
    setSelectedCalendarDate(day.dateString);
  };

  const picnicsForSelectedDate = useMemo(() => {
    if (!selectedCalendarDate) return [];
    return picnics.filter((thisPicnic) => {
      return thisPicnic.date === selectedCalendarDate;
    });
  }, [picnics, selectedCalendarDate]);

  useEffect(() => {
    console.log('picnics:', picnics);
  }, [picnics])

  return (
    <View style={{
      width: dimensions.width,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'relative',
    }} >
      <View style={{
        width: '100%',
        borderRadius: dimensions.width * 0.05,
        alignSelf: 'center',
        alignItems: 'center',
        paddingHorizontal: dimensions.width * 0.05,
        paddingVertical: dimensions.height * 0.01,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: dimensions.width * 0.01,
        backgroundColor: '#151515',
        paddingTop: dimensions.height * 0.057,
      }}>
        <Text style={{
          fontFamily: fontSfProTextRegular,
          color: 'white',
          fontWeight: 700,
          fontSize: dimensions.width * 0.064,
          alignItems: 'center',
          alignSelf: 'center',
          textAlign: 'center',
          marginLeft: dimensions.width * 0.12,
        }}
        >
          Copenhagen events
        </Text>
        <TouchableOpacity
          disabled={true}
          style={{
            opacity: 0,
          }}
          onPress={() => {
            setSelectedScreen("Calendar")
          }}>
          <Image
            source={require('../assets/icons/calendarIcon.png')}
            style={{
              width: dimensions.height * 0.03,
              height: dimensions.height * 0.03,
              margin: dimensions.height * 0.014,
              textAlign: 'center',
              alignSelf: 'center',
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>

      </View>
      <View style={{ width: '100%', flex: 1, paddingHorizontal: 4 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginBottom: dimensions.height * 0.25, marginTop: dimensions.height * 0.02 }}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={markedDates}
              theme={{
                backgroundColor: 'transparent',
                calendarBackground: 'transparent',
                textSectionTitleColor: 'white',
                selectedDayBackgroundColor: '#0875E6',
                selectedDayTextColor: 'white',
                todayTextColor: '#0875E6',
                dayTextColor: 'white',
                textDisabledColor: '#d9e1e8',
                dotColor: '#0875E6',
                selectedDotColor: '#0875E6',
                arrowColor: 'white',
                monthTextColor: 'white',
                indicatorColor: '#0875E6',
                textDayHeaderFontSize: dimensions.width * 0.036,
                textMonthFontFamily: fontSFProBold,
                textDayHeaderFontFamily: fontSFProBold,
                textDayFontSize: dimensions.width * 0.036,
                textDayFontFamily: fontSFProBold,
                textMonthFontSize: dimensions.width * 0.036,

              }}
              renderHeader={(date) => {
                return (
                  <View style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: fontSFProBold,
                        color: '#0875E6',
                        fontSize: dimensions.width * 0.046,
                      }}
                    >{formatDateHeader(date)}</Text>
                  </View>
                );
              }}
              style={{
                marginHorizontal: -dimensions.width * 0.039,
                alignSelf: 'center',
                backgroundColor: '#151515',
                paddingBottom: dimensions.height * 0.019,
                width: dimensions.width * 0.9,
                borderRadius: dimensions.width * 0.05,
                paddingTop: dimensions.width * 0.012,
              }}
            />
            {selectedCalendarDate && (
              <Text
                style={{
                  alignSelf: 'flex-start',
                  fontSize: dimensions.width * 0.057,
                  color: '#0875E6',
                  textAlign: 'center',
                  fontWeight: 700,
                  marginTop: dimensions.height * 0.012,
                  marginBottom: dimensions.height * 0.0073,
                  paddingHorizontal: dimensions.width * 0.041,
                  fontFamily: fontSFProBold,
                }}
              >
                {formatDateBottom(selectedCalendarDate)}
              </Text>
            )}
            {picnicsForSelectedDate.length === 0 ? (
              <View style={{
                backgroundColor: '#202020',
                alignSelf: 'center',
                width: '93%',
                borderRadius: dimensions.width * 0.03,
                marginBottom: dimensions.height * 0.0232,
                paddingVertical: dimensions.height * 0.04,
              }}>
                <View style={{
                  alignSelf: 'center',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text
                    style={{
                      fontFamily: fontSFProBold,
                      fontSize: dimensions.width * 0.05,
                      color: '#fff',
                      textAlign: 'center',
                      fontWeight: 600,
                      alignSelf: 'center',
                      paddingHorizontal: dimensions.width * 0.14,

                    }}
                  >
                    You didn't add any picnics on this day yet
                  </Text>
                </View>
              </View>
            ) : (
              picnicsForSelectedDate.map((thisPicnic, index) => (
                <View key={index} style={{
                  backgroundColor: '#212121',
                  alignSelf: 'center',
                  width: '93%',
                  borderRadius: dimensions.width * 0.07,
                  marginBottom: dimensions.height * 0.02,
                }}>
                  <View style={{
                    alignSelf: 'center',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: dimensions.width * 0.04,
                  }}>
                    <View style={{
                      alignSelf: 'flex-start',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: dimensions.width * 0.07,
                      paddingTop: 0,
                    }}>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '100%',
                        alignSelf: 'flex-start',
                      }}>
                        <Text
                          style={{
                            fontFamily: fontSfProTextRegular,
                            fontSize: dimensions.width * 0.043,
                            color: 'white',
                            padding: dimensions.width * 0.007,
                            fontWeight: 700,
                            maxWidth: dimensions.width * 0.46,
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {thisPicnic.heading}
                        </Text>


                        <Text
                          style={{
                            fontFamily: fontSfProTextRegular,
                            fontSize: dimensions.width * 0.043,
                            color: 'white',
                            padding: dimensions.width * 0.021,
                            fontWeight: 600,
                          }}
                        >
                          •
                        </Text>


                        <Text
                          style={{
                            fontFamily: fontSfProTextRegular,
                            fontSize: dimensions.width * 0.037,
                            color: 'white',
                            fontStyle: 'italic',

                            fontWeight: 500,
                            paddingHorizontal: dimensions.width * 0.021,
                            textDecorationLine: 'underline',
                          }}
                        >
                          {thisPicnic.date}
                        </Text>

                      </View>

                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                      }}>

                        <Text
                          style={{
                            fontFamily: fontSfProTextRegular,
                            fontSize: dimensions.width * 0.04,
                            color: 'white',
                            fontWeight: 600,
                            padding: dimensions.width * 0.007,
                          }}
                        >
                          Place:
                        </Text>

                        <Text
                          style={{
                            fontFamily: fontSfProTextRegular,
                            fontSize: dimensions.width * 0.037,
                            color: 'white',
                            fontWeight: 500,
                            padding: dimensions.width * 0.007,
                          }}
                        >
                          {thisPicnic.selectedPicnicPlace.title}
                        </Text>
                      </View>


                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                      }}>

                        <Text
                          style={{
                            fontFamily: fontSfProTextRegular,
                            fontSize: dimensions.width * 0.04,
                            color: 'white',
                            fontWeight: 600,
                            padding: dimensions.width * 0.007,
                            maxWidth: dimensions.width * 0.88,
                          }}
                        >
                          Address: <Text
                            style={{
                              fontFamily: fontSfProTextRegular,
                              fontSize: dimensions.width * 0.037,
                              color: 'white',
                              fontWeight: 500,
                              padding: dimensions.width * 0.007,
                              
                            }}
                          >
                            {thisPicnic.selectedPicnicPlace.address}
                          </Text>
                        </Text>


                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default CalendarScreen;
