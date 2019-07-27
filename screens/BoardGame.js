import React from 'react'
import {StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder} from 'react-native'
import {db} from '../src/config'
import firebase from 'firebase'

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class BoardGame extends React.Component{
    constructor(props) {
        super(props);

        this.position = new Animated.ValueXY()

        this.state = {
            bg: props.bg
        }
        
        this.PanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
                //sets x and y values to wherever gesture state x and y are
                this.position.setValue({x: gestureState.dx, y: gestureState.dy})
            },
            onPanResponderRelease: (evt, gestureState) => {
            const userId = firebase.auth().currentUser.uid;

                // swipe right at a considerable distance
                if(gestureState.dx > 120) {
                    Animated.spring(this.position, {
                        toValue: {x: SCREEN_WIDTH + 100, y: gestureState.dy}
                    }).start(() => {
                        // this.setState({currentIndex: this.state.currentIndex + 1}, () => {
                        //     this.position.setValue({x: 0, y: 0})
                        // })
                        this.props.updateIndex()
                    })

                    //add document to Likes collection
                    let data = {
                        userId: userId,
                        boardgameId: this.state.bg.boardgameId
                    }
                    db.collection('Likes').doc(`${userId}_${this.state.bg.boardgameId}`).set(data)

                    //update boardgame instance
                    let dbBg;
                    db.collection('BoardGames').where('boardgameId', '==', this.state.bg.boardgameId).get()
                    .then((snapshot) => {
                        snapshot.docs.forEach((doc) => {
                            const bg = doc.data();
                            dbBg = bg;
                            dbBg.currNumOfPlayers++;
                            //if boardgame instance is now full
                            if (dbBg.currNumOfPlayers === dbBg.maxNumOfPlayers) {
                                dbBg.isFull = true;
                                this.createChat()
                            }
                        })
                    })
                    .then(() => db.collection('BoardGames').doc(this.state.bg.boardgameId).set(dbBg))
               
                } // swipe left at a considerable distance 
                else if (gestureState.dx < -120) {
                    Animated.spring(this.position, {
                        toValue: {x: -SCREEN_WIDTH - 100, y: gestureState.dy}
                    }).start(() => {
                        // this.setState({currentIndex: this.state.currentIndex + 1}, () => {
                        //     this.position.setValue({x: 0, y: 0})
                        // })
                        this.props.updateIndex()

                    })
                    let data = {
                        userId: userId,
                        boardgameId: this.state.bg.boardgameId
                    }
                    db.collection('Dislikes').doc(`${userId}_${this.state.bg.boardgameId}`).set(data)
                
                }
                else {
                    Animated.spring(this.position, {
                        toValue: {x: 0, y: 0},
                        friction: 4,
                    }).start()
                }
            }
        })

        this.rotate = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
            //when user swipes towards left, we want the image to go -10deg, center stay at 0, and towards the right, move image 10deg
            outputRange: ['-10deg', '0deg', '10deg'],
            //clamp at 10 degrees
            extrapolate: 'clamp'
        })

        this.rotateAndTranslate = {
            transform: [{
                rotate: this.rotate
            },
            //automatically convert to X and Y axis
            ...this.position.getTranslateTransform()
            ]
        }

        this.likeOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
            outputRange: [0,0,1],
            extrapolate: 'clamp'
        })

        this.dislikeOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
            outputRange: [1,0,0],
            extrapolate: 'clamp'
        })

        this.nextCardOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
            outputRange: [1, 1, 1],
            extrapolate: 'clamp'
        })

        this.nextCardScale = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
            outputRange: [1, 0.8, 1],
            extrapolate: 'clamp'
        })
    }


    createChat = () => {
        let users =[]
        db.collection('Likes').where('boardgameId', '==', this.state.bg.boardgameId).get()
        .then((snapshot) => {
            snapshot.docs.forEach(doc => {
                const user = doc.data();
                users.push(user.userId)
            })
        })
        .then(() =>
            db.collection('Chats').add({
                name: this.state.bg.name,
                boardgameId: this.state.bg.boardgameId,
                members: users,
                chatId: null
            })
        )
        .then((docRef) => docRef.id)
        .then((chatId) => {
            
            db.collection('Chats').doc(chatId).update({chatId: chatId})
                
        })
        .catch((err) => console.log(err))
    }

    render() {
        const {index, currentIndex, bg} = this.props

        let image = {uri: bg.image}
        if(index < currentIndex){
            return null
        }

        return index === currentIndex ? (
            (     
            <Animated.View 
            {...this.PanResponder.panHandlers}
            key = {bg.boardgameId}
            style = {[styles.boardgames, this.rotateAndTranslate]} >

            <Animated.View style = {[styles.likeTextContainer, {opacity: this.likeOpacity}]} >
                <Text style = {styles.likeText}>
                    LIKE
                </Text>
            </Animated.View>
            
            <Animated.View style = {[styles.dislikeTextContainer, {opacity: this.dislikeOpacity}]} >
                <Text style = {styles.dislikeText}>
                    NOPE
                </Text>
            </Animated.View>

            <Image
                style = {styles.image}
                source = {image} />
            </Animated.View>
            )
        ) :
        (     
                <Animated.View 
                key = {bg.boardgameId}
                style = {[styles.boardgames, {opacity: this.nextCardOpacity, transform: [{scale: this.nextCardScale}]}]} >

                <Image
                    style = {styles.image}
                    source = {image} />
                </Animated.View>
                )
            }
        }


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center' 
    },
    boardgames: {
        height: SCREEN_HEIGHT - 120, 
        width: SCREEN_WIDTH, 
        padding: 20,
        position: 'absolute',

    },
    image: {
        flex:1, 
        height: null, 
        width: null, 
        resizeMode: 'cover', 
        borderRadius: 20
    },
    likeTextContainer: {
        transform: [{rotate: '-30deg'}],
        position: 'absolute',
        top: 50,
        left: 40,
        zIndex: 1000
    },
    dislikeTextContainer: {
        transform: [{rotate: '30deg'}],
        position: 'absolute',
        top: 50,
        right: 40,
        zIndex: 1000
    },
    likeText: {
        color: 'green',
        borderColor: 'green',
        fontSize: 32,
        fontWeight: '800',
        borderWidth: 1,
        padding: 12
    },
    dislikeText: {
        color: 'red',
        borderColor: 'red',
        fontSize: 32,
        fontWeight: '800',
        borderWidth: 1,
        padding: 12
    }
})