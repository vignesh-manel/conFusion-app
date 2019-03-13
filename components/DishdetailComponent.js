import React, { Component } from 'react';
import { View, Text,ScrollView, FlatList,Modal,Button,StyleSheet, Alert, PanResponder } from 'react-native';
import { Card,Icon,Rating,Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite,postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
	dishes: state.dishes,
	comments: state.comments,
	favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (comment) => dispatch(postComment(comment))
});


function RenderDish(props) {
    const dish = props.dish;

    handleViewRef = ref => this.view = ref;

    const recognizeDrag = ({moveX, moveY, dx, dy})  => {
	if (dx < -200)
	    return true;
	else
	    return false;
    }

   const recognizeComment = ({moveX, moveY, dx, dy}) => {
	if(dx > 200)
	    return true;
	else
	    return false;
   }

    const panResponder = PanResponder.create({
	onStartShouldSetPanResponder: (e, gestureState) => {
	    return true;
	},
	onPanResponderGrant: () => {
	    this.view.rubberBand(1000)
		.then(endState => console.log(endState.finished ? 'finished': 'cancelled'))
	},
	onPanResponderEnd: (e, gestureState) => {
	    if (recognizeDrag(gestureState))
		Alert.alert(
		    'Add to Favorites',
		    'Are you sure, you wish to add '+dish.name+' to yoir Favorites}',
		    [
			{
			    text: 'Cancel',
			    onPress: () => {},
			    style: 'cancel'
			},
			{
			    text: 'OK',
			    onPress: () => props.favorite ? alert('Already Favorite') : props.onPress()
			}
		    ]
		)
		if(recognizeComment(gestureState))
		    props.commentForm();
	    return true;
	}
    });

    if(dish != null) {
	return (
	  <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
		ref={this.handleViewRef}
		{...panResponder.panHandlers}>
	    <Card
		featuredTitle={dish.name}
		image={{uri: baseUrl + dish.image}}>
		<Text style={{margin:10}}>{dish.description}</Text>
		<View style={{flexDirection:'row',justifyContent:'center'}}>
		<Icon raised reverse name={props.favorite ? 'heart' : 'heart-o' }
		    type='font-awesome' color='#f58'
		    onPress={() => props.favorite ? alert('Already Favorite') : props.onPress()} />
		<Icon raised reverse name='pencil' type='font-awesome' 
		    color='#512DA8' onPress={() => props.commentForm()}/>
		</View>
	    </Card>
	   </Animatable.View>
	);
    }
    else {
	return(<View></View>);
    }
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({ item, index}) => {
	return (
	    <View key={index} style={{margin:10}}>
		<Text style={{fontSize:14}}>{item.comment}</Text>
		<Rating
		    readonly
		    type='star'
		    imageSize={10}
		    startingValue={item.rating}
		    style={{
            		display: 'flex', flex: 1, flexDirection: 'row',
            		justifyContent: 'flex-start', padding: 5}}/>
		<Text style={{fontSize:12}}>{'-- '+item.author+', '+item.date}</Text>
	    </View>
	);
    }

    return (
	<Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
	<Card title="Comments">
	    <FlatList
		data={comments}
		renderItem={renderCommentItem}
		keyExtractor={item => item.id.toString()} />
	</Card>
	</Animatable.View>
    );
}

class Dishdetail extends Component {

    constructor(props) {
	super(props)
	this.state={
	author: '',
	comment:'',
	rating:0,
	showModal:false
	}
    }

    markFavorite(dishId) {
	this.props.postFavorite(dishId);
    }

    static navigationOptions = {
	title: 'Dish Details'
    };

    toggleModal() {
	this.setState({showModal: !this.state.showModal })
    }

    commentForm() {
	this.toggleModal();
    }

    submitComment(comment) {
	if(this.state.author!='' || this.state.comment!='')
	this.props.postComment(comment)
    }

    resetForm() {
	this.setState({
	    author:'',
	    comment:'',
	    rating:0
	})
    }

    render() {
    const dishId = this.props.navigation.getParam('dishId','');
     return (
	<ScrollView>
	    <RenderDish dish={this.props.dishes.dishes[+dishId]}
		favorite={this.props.favorites.some(el => el === dishId)}
		onPress={() => this.markFavorite(dishId)}
		commentForm={() => this.commentForm()}/>
	    <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
		<Modal
		    animationType={'slide'}
		    transparent={false}
		    visible={this.state.showModal}
		    onDismiss={() => {this.toggleModal()}}
		    onRequestClose={() => {this.toggleModal()}}>
		    <View>
			<Rating
  			    showRating
  			    type="star"
  			    startingValue={0}
  			    imageSize={40}
  			    style={{ flexDirection:'column',alignItems:'center' }}
			    onFinishRating={(value) => this.setState({rating: value})}
			/>
			<Input
			    placeholder='Author'
			    leftIcon= {
				<Icon
				    name='user-o'
				    type='font-awesome'
				    size={24}
				    color='black'/>
			    }
			    style={{paddingBottom:30}}
			    onChangeText={(text) => this.setState({author:text})}
			    />
			<Input
			    placeholder='Comment'
			    leftIcon={
				<Icon
				    name='comment-o'
				    type='font-awesome'
				    size={24}
				    color='black'/>
				}
			    style={{paddingBottom:30}}
			    onChangeText={(text)=> this.setState({comment:text})}
			    />
			<View style={{marginTop:40}}>
			<Button
			    onPress={() => {this.submitComment({dishId:dishId,rating:this.state.rating,author:this.state.author,comment:this.state.comment});this.toggleModal();this.resetForm()}}
			    color='#512DA8'
			    title='Submit'/>
			</View>
			<View style={{marginTop:20}}>
			<Button
			    onPress={() => {this.toggleModal()}}
			    color='grey'
			    title='Cancel'/>
			</View>
		    </View>
		</Modal>
	</ScrollView>
    );
    }
}

const styles = StyleSheet.create({

})

export default connect(mapStateToProps,mapDispatchToProps)(Dishdetail);
