import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    SafeAreaView,
    ScrollView,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { set } from 'date-fns';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const fontInterRegular = 'Inter18pt-Regular';

const GoalsScreen = ({ setSelectedScreen, selectedScreen }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [storageImage, setStorageImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [heading, setHeading] = useState('');
    const [description, setDescription] = useState('');
    const [goals, setGoals] = useState([]);
    const [activeSwipeableId, setActiveSwipeableId] = useState(null);
    const swipeableRefs = useRef(new Map());

    const loadGoals = async () => {
        try {
            const existingGoals = await AsyncStorage.getItem('goals');
            if (existingGoals) {
                setGoals(JSON.parse(existingGoals));
            }
        } catch (error) {
            console.error('Error loading goals:', error);
        }
    };

    const removeGoal = async (GoalToRemove) => {
        try {
            const updatedGoals = goals.filter(goal =>
                !(goal.heading === GoalToRemove.heading && goal.description === GoalToRemove.description && goal.id === GoalToRemove.id)
            );
            await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
            setGoals(updatedGoals);
        } catch (error) {
            console.error('Error removing goal:', error);
            Alert.alert('Error', 'Failed to remove goal from goals.');
        }
    };

    useEffect(() => {
        loadGoals();
    }, [goals, selectedScreen]);

    const saveGoal = async () => {
        try {
            const existingGoals = await AsyncStorage.getItem('goals');
            const goals = existingGoals ? JSON.parse(existingGoals) : [];

            const maxId = goals.length > 0 ? Math.max(...goals.map(goal => goal.id)) : 0;

            const newGoal = { id: maxId + 1, heading, description, status: 'incomplete' };

            goals.unshift(newGoal);

            await AsyncStorage.setItem('goals', JSON.stringify(goals));

            setGoals(goals);

            setModalVisible(false);
            setHeading('');
            setDescription('');
        } catch (error) {
            console.error('Error saving goal', error);
        }
    };

    const renderRightRemoveActions = (item) => (
        <TouchableOpacity
            onPress={() => removeGoal(item)}
            style={{
                backgroundColor: 'transparent',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                width: dimensions.width * 0.16,
            }}
        >
            <Image
                source={require('../assets/icons/trashCopenIcon.png')}
                style={{
                    width: dimensions.height * 0.037,
                    height: dimensions.height * 0.037,
                }}
                resizeMode="contain"
            />
        </TouchableOpacity>
    );

    const handleDotsPress = (id) => {
        swipeableRefs.current.forEach((ref, key) => {
            if (key !== id && ref) {
                ref.close();
            }
        });

        const currentRef = swipeableRefs.current.get(id);
        if (currentRef) {
            if (activeSwipeableId === id) {
                currentRef.close();
                setActiveSwipeableId(null);
            } else {
                currentRef.openRight();
                setActiveSwipeableId(id);
            }
        }
    };

    const handleSwipeableOpen = (id) => {
        swipeableRefs.current.forEach((ref, key) => {
            if (key !== id && ref) {
                ref.close();
            }
        });
        setActiveSwipeableId(id);
    };

    const handleSwipeableClose = (id) => {
        if (activeSwipeableId === id) {
            setActiveSwipeableId(null);
        }
    };

    const toggleGoalStatus = async (goal) => {
        const updatedGoals = goals.map(g => {
            if (g.id === goal.id) {
                return { ...g, status: g.status === 'incomplete' ? 'complete' : 'incomplete' };
            }
            return g;
        });

        const sortedGoals = updatedGoals.sort((a, b) => a.status === 'complete' ? 1 : -1);

        setGoals(sortedGoals);
        await AsyncStorage.setItem('goals', JSON.stringify(sortedGoals));
    };

    return (
        <View style={{
            width: dimensions.width,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            width: '100%',
            zIndex: 1,
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
                    fontFamily: fontInterRegular,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: dimensions.width * 0.064,
                    alignItems: 'center',
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginLeft: dimensions.width * 0.3,
                }}
                >
                    My goals
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

            {goals.length !== 0 ? (
                <ScrollView style={{ flex: 1, width: '100%' }}>
                    <View style={{
                        width: '100%',
                        alignSelf: 'center',
                        flex: 1,
                        marginTop: dimensions.height * 0.02,
                        marginBottom: dimensions.height * 0.16,
                    }}>
                        {goals.map((goal, index) => (
                            <Swipeable
                                key={goal.id}
                                ref={(ref) => {
                                    if (ref) {
                                        swipeableRefs.current.set(goal.id, ref);
                                    } else {
                                        swipeableRefs.current.delete(goal.id);
                                    }
                                }}
                                renderRightActions={() => renderRightRemoveActions(goal)}
                                onSwipeableOpen={() => handleSwipeableOpen(goal.id)}
                                onSwipeableClose={() => handleSwipeableClose(goal.id)}
                            >
                                <TouchableOpacity 
                                    onPress={() => toggleGoalStatus(goal)}
                                    key={index} style={{
                                        width: '91%',
                                        alignSelf: 'center',
                                        backgroundColor: '#151515',
                                        borderRadius: dimensions.width * 0.046,
                                        position: 'relative',
                                        zIndex: 1,
                                        paddingVertical: dimensions.width * 0.05,
                                        paddingHorizontal: dimensions.width * 0.055,
                                        marginVertical: dimensions.height * 0.01,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        opacity: goal.status === 'complete' ? 0.7 : 1,
                                    }}>
                                    <View style={{
                                        maxWidth: '73%'
                                    }}>
                                        <Text
                                            style={{
                                                fontSize: dimensions.width * 0.043,
                                                fontFamily: fontInterRegular,
                                                color: 'white',
                                                textAlign: 'left',
                                                alignSelf: 'flex-start',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                fontWeight: 800,
                                                paddingHorizontal: dimensions.width * 0.012,
                                            }}>
                                            {goal.heading}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: dimensions.width * 0.037,
                                                fontFamily: fontInterRegular,
                                                color: 'white',
                                                opacity: 0.7,
                                                textAlign: 'left',
                                                alignSelf: 'flex-start',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                fontWeight: 400,
                                                paddingHorizontal: dimensions.width * 0.012,
                                                marginTop: dimensions.height * 0.01,
                                            }}>
                                            {goal.description}
                                        </Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        maxWidth: '23%',
                                        alignItems: 'center',
                                        flex: 1,
                                    }}>
                                        <TouchableOpacity
                                            onPress={() => toggleGoalStatus(goal)}
                                            style={{
                                                zIndex: 100,
                                            }}>
                                            <Image
                                                source={goal.status === 'incomplete' 
                                                    ? require('../assets/icons/emptyRadioButtonIcon.png')
                                                    : require('../assets/icons/fullRadioButtonIcon.png')}
                                                style={{
                                                    width: dimensions.height * 0.025,
                                                    height: dimensions.height * 0.025,
                                                    textAlign: 'center'
                                                }}
                                                resizeMode="contain"
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleDotsPress(goal.id)}
                                            style={{
                                                zIndex: 100,
                                            }}>
                                            <Image
                                                source={require('../assets/icons/tablerDotsIcon.png')}
                                                style={{
                                                    width: dimensions.height * 0.044,
                                                    height: dimensions.height * 0.044,
                                                    textAlign: 'center'
                                                }}
                                                resizeMode="contain"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            </Swipeable>
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <View>
                    <Image
                        resizeMode='contain'
                        source={require('../assets/icons/emptyChecklist.png')}
                        style={{
                            width: dimensions.width * 0.34,
                            height: dimensions.width * 0.34,
                            alignSelf: 'center',
                            marginTop: dimensions.height * 0.19,
                        }}
                    />
                    <Text
                        style={{
                            fontSize: dimensions.width * 0.037,
                            fontFamily: fontInterRegular,
                            color: 'white',
                            textAlign: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontWeight: 500,
                            marginTop: dimensions.height * 0.03,
                            paddingHorizontal: dimensions.width * 0.19,
                        }}>
                        There aren’t any goals yet, create something
                    </Text>
                </View>
            )}

            <TouchableOpacity
                onPress={() => { 
                    setModalVisible(true);
                }}
                style={{
                    width: dimensions.width * 0.95,
                    height: dimensions.height * 0.07,
                    backgroundColor: '#0875E6',
                    borderRadius: dimensions.width * 0.037,
                    position: 'absolute',
                    bottom: '16%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                }}
            >
                <Text
                    style={{
                        fontFamily: fontInterRegular,
                        fontSize: dimensions.width * 0.037,
                        color: 'white',
                        fontWeight: 700,
                    }}
                >
                    Create new goal
                </Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <SafeAreaView
                    style={{
                        alignSelf: 'center',
                        alignItems: 'center',
                        width: '100%',
                        paddingHorizontal: dimensions.width * 0.05,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        width: dimensions.width,
                        zIndex: 1000,
                        backgroundColor: '#000000',
                        height: dimensions.height,
                    }}
                >
                    <View style={{
                        zIndex: 50,
                        alignSelf: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '97%',
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(false);
                            }}
                            style={{
                                borderRadius: dimensions.width * 0.5,
                                zIndex: 100,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <ChevronLeftIcon size={dimensions.height * 0.034} color='#0875E6' />
                            <Text style={{
                                fontFamily: fontInterRegular,
                                color: '#0875E6',
                                fontWeight: 400,
                                fontSize: dimensions.width * 0.043,
                                alignItems: 'center',
                                alignSelf: 'center',
                                textAlign: 'center',
                            }}
                            >
                                Back
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{
                        width: dimensions.width * 0.93,
                        alignItems: 'center',
                        alignSelf: 'center',
                    }}>
                        <Text style={{
                            fontFamily: fontInterRegular,
                            color: 'white',
                            fontWeight: 700,
                            fontSize: dimensions.width * 0.068,
                            alignSelf: 'flex-start',
                            textAlign: 'center',
                            marginTop: dimensions.height * 0.01,
                        }}
                        >
                            New checklist
                        </Text>

                        <Text style={{
                            fontFamily: fontInterRegular,
                            color: 'white',
                            fontWeight: 400,
                            fontSize: dimensions.width * 0.04,
                            alignSelf: 'flex-start',
                            textAlign: 'center',
                            marginTop: dimensions.height * 0.025,
                        }}
                        >
                            Heading
                        </Text>

                        <TextInput
                            placeholder="Heading"
                            value={heading}
                            onChangeText={setHeading}
                            placeholderTextColor="#999999"
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingVertical: dimensions.width * 0.035,
                                paddingHorizontal: dimensions.width * 0.04,
                                backgroundColor: '#161616',
                                borderRadius: dimensions.width * 0.03,
                                width: '100%',
                                color: 'white',
                                fontFamily: fontInterRegular,
                                fontSize: dimensions.width * 0.041,
                                fontWeight: 400,
                                textAlign: 'left',
                                marginTop: dimensions.height * 0.01,
                            }}
                        />

                        <Text style={{
                            fontFamily: fontInterRegular,
                            color: 'white',
                            fontWeight: 400,
                            fontSize: dimensions.width * 0.04,
                            alignSelf: 'flex-start',
                            textAlign: 'center',
                            marginTop: dimensions.height * 0.025,
                        }}
                        >
                            Description
                        </Text>

                        <TextInput
                            placeholder="Description"
                            value={description}
                            onChangeText={setDescription}
                            placeholderTextColor="#999999"
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingVertical: dimensions.width * 0.035,
                                paddingHorizontal: dimensions.width * 0.04,
                                backgroundColor: '#161616',
                                borderRadius: dimensions.width * 0.03,
                                width: '100%',
                                color: 'white',
                                fontFamily: fontInterRegular,
                                fontSize: dimensions.width * 0.041,
                                fontWeight: 400,
                                textAlign: 'left',
                                marginTop: dimensions.height * 0.01,
                            }}
                        />
                    </View>

                    <TouchableOpacity
                        disabled={heading === '' || description === ''}
                        onPress={saveGoal}
                        style={{
                            width: dimensions.width * 0.93,
                            height: dimensions.height * 0.07,
                            backgroundColor: '#0875E6',
                            borderRadius: dimensions.width * 0.037,
                            position: 'absolute',
                            bottom: '7%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            opacity: heading === '' || description === '' ? 0.5 : 1,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: fontInterRegular,
                                fontSize: dimensions.width * 0.037,
                                color: 'white',
                                fontWeight: 700,
                            }}
                        >
                            Save
                        </Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>
        </View>
    );
};

export default GoalsScreen;
