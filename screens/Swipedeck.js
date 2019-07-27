import React from 'react'
import {StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder} from 'react-native'
import {db} from '../src/config'
import firebase from 'firebase'
import BoardGame from './BoardGame'





const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class SwipeDeck extends React.Component {
    constructor() {
        super()

        this.position = new Animated.ValueXY()
        this.state = {
            currentIndex:0,
            BoardGames: [],
            boardgame: {},
            userId: null
        }

        this.swipeMovements = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
                //sets x and y values to wherever gesture state x and y are
                this.position.setValue({x: gestureState.dx, y: gestureState.dy})
            },
            onPanResponderRelease: (evt, gestureState) => {
                // swipe right at a considerable distance
                if(gestureState.dx > 120) {
                    Animated.spring(this.position, {
                        toValue: {x: SCREEN_WIDTH + 100, y: gestureState.dy}
                    }).start(() => {
                        this.setState({currentIndex: this.state.currentIndex + 1}, () => {
                            this.position.setValue({x: 0, y: 0})
                        })
                    })

                } // swipe left at a considerable distance 
                else if (gestureState.dx < -120) {
                    Animated.spring(this.position, {
                        toValue: {x: -SCREEN_WIDTH - 100, y: gestureState.dy}
                    }).start(() => {
                        this.setState({currentIndex: this.state.currentIndex + 1}, () => {
                            this.position.setValue({x: 0, y: 0})
                        })
                    })
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

    componentDidMount() {
        // this.PanResponder = PanResponder.create({
        //     onStartShouldSetPanResponder: (evt, gestureState) => true,
        //     onPanResponderMove: (evt, gestureState) => {
        //         //sets x and y values to wherever gesture state x and y are
        //         this.position.setValue({x: gestureState.dx, y: gestureState.dy})
        //     },
        //     onPanResponderRelease: (evt, gestureState) => {
        //         // swipe right at a considerable distance
        //         if(gestureState.dx > 120) {
        //             Animated.spring(this.position, {
        //                 toValue: {x: SCREEN_WIDTH + 100, y: gestureState.dy}
        //             }).start(() => {
        //                 this.setState({currentIndex: this.state.currentIndex + 1}, () => {
        //                     this.position.setValue({x: 0, y: 0})
        //                 })
        //             })

        //         } // swipe left at a considerable distance 
        //         else if (gestureState.dx < -120) {
        //             Animated.spring(this.position, {
        //                 toValue: {x: -SCREEN_WIDTH - 100, y: gestureState.dy}
        //             }).start(() => {
        //                 this.setState({currentIndex: this.state.currentIndex + 1}, () => {
        //                     this.position.setValue({x: 0, y: 0})
        //                 })
        //             })
        //         }
        //         else {
        //             Animated.spring(this.position, {
        //                 toValue: {x: 0, y: 0},
        //                 friction: 4,
        //             }).start()
        //         }
        //     }
        // })

        let userLikes = [];
        let userDislikes = [];
        if (firebase.auth().currentUser) {
            const userId = firebase.auth().currentUser.uid;
            this.setState({userId: userId})
        }

        db.collection('Likes').where('userId', '==' , this.state.userId ).get()
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                const like = doc.data();
                userLikes.push(like.boardgameId)
            })
        })

        db.collection('Dislikes').where('userId', '==' , this.state.userId ).get()
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                const dislike = doc.data();
                userDislikes.push(dislike.boardgameId)
            })
        })

        db.collection('BoardGames').get()
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                const bg = doc.data()
                // boardgame session is not full yet
                if (!bg.isFull && !userLikes.includes(bg.boardgameId) && !userDislikes.includes(bg.boardgameId)) {
                    let newState = this.state.BoardGames;
                    newState.push(bg)
                    this.setState({BoardGames: newState})
                }
 
            })
        })
        .then(() => console.log('state: ', this.state.BoardGames))
        .catch((err) => console.log(err))

    }

    showBoardGames = () => {
        return (
            // this.state.BoardGames.map((bg, index) => {
            // let image = {uri: bg.image}
            // if(index < this.state.currentIndex){
            //     return null
            // }
            // else if(index === this.state.currentIndex){   
            //     return (     
            //     <Animated.View 
            //     {...this.PanResponder.panHandlers}
            //     key = {bg.boardgameId}
            //     style = {[styles.boardgames, this.rotateAndTranslate]} >

            //     <Animated.View style = {[styles.likeTextContainer, {opacity: this.likeOpacity}]} >
            //         <Text style = {styles.likeText}>
            //             LIKE
            //         </Text>
            //     </Animated.View>
                
            //     <Animated.View style = {[styles.dislikeTextContainer, {opacity: this.dislikeOpacity}]} >
            //         <Text style = {styles.dislikeText}>
            //             NOPE
            //         </Text>
            //     </Animated.View>

            //     <Image
            //         style = {styles.image}
            //         source = {image} 
            //         onChange = {() => this.handleOnPress(bg)}                    
            //     />
            //     </Animated.View>
            //     )
            // } else {
            //     return (     
            //         <Animated.View 
            //         key = {bg.boardgameId}
            //         style = {[styles.boardgames, {opacity: this.nextCardOpacity, transform: [{scale: this.nextCardScale}]}]} >

            //         <Image
            //             style = {styles.image}
            //             source = {image} />
            //         </Animated.View>
            //         )
            //     }
            // }
            // )
            this.state.BoardGames.map((bg, index) => {
                return (
                    <BoardGame key = {bg.boardgameId} bg = {bg} index = {index} currentIndex = {this.state.currentIndex} updateIndex = {this.updateIndex} />
                )
            }
        ).reverse())
    }
    updateIndex = () => {
        const oldIndex  = this.state.currentIndex;

        this.setState({currentIndex: oldIndex + 1})
        this.position.setValue({x: 0, y: 0})
    }
    render() {
        return (
            <View style = {styles.container} >

                <View style = {styles.container} >
                 <Text style = {{padding: 100}}> No More Board Games... for now ;)  </Text>

                    {this.showBoardGames()}
               
                </View>

            </View>
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